package com.thinkbuild.accounts.auth;

import com.thinkbuild.accounts.common.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and session management API")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final LoginThrottleService loginThrottleService;
    private final PermissionService permissionService;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final JwtProperties jwtProperties;

    @PostMapping("/login")
    @Operation(summary = "Login with username and password", description = "Authenticates user and returns JWT access and refresh tokens")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);

        if (loginThrottleService.isLocked(request.username())) {
            log.warn("Login attempt for locked account: {}", request.username());
            return ResponseEntity.status(HttpStatus.LOCKED)
                    .body(Map.of("message", "Account temporarily locked due to excessive failed attempts. Please try again later."));
        }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            User user = (User) auth.getPrincipal();

            // Reset throttle and update login success fields
            loginThrottleService.reset(request.username());
            user.setLastLoginAt(Instant.now());
            user.setFailedAttempts(0);
            user.setLockedUntil(null);
            userRepository.save(user);

            // Generate tokens
            String accessToken = jwtService.generateAccessToken(user);
            String tokenId = UUID.randomUUID().toString();
            String refreshToken = jwtService.generateRefreshToken(user, tokenId);

            // Store refresh token in Redis
            refreshTokenService.store(user.getId(), tokenId, Duration.ofMillis(jwtProperties.refreshExpiryMs()));

            // Retrieve permissions
            Map<String, PermissionDto> permissions = permissionService.getPermissionsForRole(user.getRole().getId());

            // Log audit asynchronously
            auditService.log(user.getId(), "LOGIN_SUCCESS", "USER", user.getId().toString(), "User logged in", ip);

            return ResponseEntity.ok(new LoginResponse(accessToken, refreshToken, UserInfo.fromEntity(user), permissions));
        } catch (AuthenticationException ex) {
            log.warn("Failed login attempt for user '{}' from IP {}: {}", request.username(), ip, ex.getMessage());

            loginThrottleService.recordFailure(request.username());

            userRepository.findByUsername(request.username()).ifPresent(user -> {
                int attempts = user.getFailedAttempts() + 1;
                user.setFailedAttempts(attempts);
                if (attempts >= 5) {
                    user.setLockedUntil(Instant.now().plus(Duration.ofMinutes(5)));
                }
                userRepository.save(user);
            });

            auditService.log(null, "LOGIN_FAILED", "USER", request.username(), "Failed login attempt", ip);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT access token", description = "Issues a new access and refresh token pair using an existing refresh token")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequest request) {
        if (!jwtService.isTokenValid(request.refreshToken(), true)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired refresh token"));
        }

        String username = jwtService.extractUsername(request.refreshToken(), true);
        String tokenId = jwtService.extractTokenId(request.refreshToken());

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null || tokenId == null || !refreshTokenService.exists(user.getId(), tokenId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or revoked refresh token"));
        }

        // Revoke the old refresh token
        refreshTokenService.revoke(user.getId(), tokenId);

        // Generate new pair
        String newAccessToken = jwtService.generateAccessToken(user);
        String newTokenId = UUID.randomUUID().toString();
        String newRefreshToken = jwtService.generateRefreshToken(user, newTokenId);

        refreshTokenService.store(user.getId(), newTokenId, Duration.ofMillis(jwtProperties.refreshExpiryMs()));

        return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "refreshToken", newRefreshToken
        ));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Revokes refresh token and terminates session")
    public ResponseEntity<?> logout(@RequestBody(required = false) RefreshRequest request,
                                    HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        Long userId = null;

        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            try {
                userId = jwtService.extractUserId(token, false);
            } catch (Exception ignored) {
            }
        }

        if (request != null && request.refreshToken() != null && !request.refreshToken().isBlank()) {
            try {
                if (jwtService.isTokenValid(request.refreshToken(), true)) {
                    String tokenId = jwtService.extractTokenId(request.refreshToken());
                    Long refreshUserId = jwtService.extractUserId(request.refreshToken(), true);
                    if (refreshUserId != null && tokenId != null) {
                        refreshTokenService.revoke(refreshUserId, tokenId);
                        if (userId == null) {
                            userId = refreshUserId;
                        }
                    }
                }
            } catch (Exception ignored) {
            }
        } else if (userId != null) {
            refreshTokenService.revokeAll(userId);
        }

        auditService.log(userId, "LOGOUT", "USER", userId != null ? userId.toString() : "unknown", "User logged out", ip);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current authenticated user info", description = "Returns user profile and permissions for currently authenticated user")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        Map<String, PermissionDto> permissions = permissionService.getPermissionsForRole(user.getRole().getId());

        return ResponseEntity.ok(Map.of(
                "user", UserInfo.fromEntity(user),
                "permissions", permissions
        ));
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
