package com.thinkbuild.accounts.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    private SecretKey getSigningKey(String secret) {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (Exception e) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.accessExpiryMs());

        String roleName = user.getRole() != null ? user.getRole().getName() : "";

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("role", roleName)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(jwtProperties.secret()))
                .compact();
    }

    public String generateRefreshToken(User user, String tokenId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.refreshExpiryMs());

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("tokenId", tokenId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(jwtProperties.refreshSecret()))
                .compact();
    }

    public Claims parseToken(String token, boolean isRefresh) {
        SecretKey key = isRefresh 
                ? getSigningKey(jwtProperties.refreshSecret()) 
                : getSigningKey(jwtProperties.secret());

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token, boolean isRefresh) {
        try {
            Claims claims = parseToken(token, isRefresh);
            return claims.getExpiration() != null && claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public String extractUsername(String token, boolean isRefresh) {
        return parseToken(token, isRefresh).getSubject();
    }

    public Long extractUserId(String token, boolean isRefresh) {
        Claims claims = parseToken(token, isRefresh);
        Number userId = claims.get("userId", Number.class);
        return userId != null ? userId.longValue() : null;
    }

    public String extractRole(String token) {
        return parseToken(token, false).get("role", String.class);
    }

    public String extractTokenId(String token) {
        return parseToken(token, true).get("tokenId", String.class);
    }
}
