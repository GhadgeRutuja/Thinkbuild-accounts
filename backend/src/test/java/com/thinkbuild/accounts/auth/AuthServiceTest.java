package com.thinkbuild.accounts.auth;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AuthServiceTest {

    private JwtService jwtService;
    private JwtProperties jwtProperties;
    private User testUser;

    private static final String TEST_SECRET = "VGhpbmtCdWlsZEFjY291bnRzU2VjcmV0S2V5Rm9ySlNPTldlYlRva2VuMjAyNA==";
    private static final String TEST_REFRESH_SECRET = "VGhpbmtCdWlsZEFjY291bnRzUmVmcmVzaFNlY3JldEtleUZvckpTT05XZWJUb2tlbjIwMjQ=";

    @BeforeEach
    void setUp() {
        jwtProperties = new JwtProperties(TEST_SECRET, TEST_REFRESH_SECRET, 900000L, 604800000L);
        jwtService = new JwtService(jwtProperties);

        Role adminRole = Role.builder().id(1L).name("Admin").build();
        testUser = User.builder()
                .id(1L)
                .username("admin")
                .fullName("System Administrator")
                .email("admin@thinkbuild.com")
                .role(adminRole)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Should generate and correctly parse access token")
    void testGenerateAndParseAccessToken() {
        String token = jwtService.generateAccessToken(testUser);

        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token, false)).isTrue();

        Claims claims = jwtService.parseToken(token, false);
        assertThat(claims.getSubject()).isEqualTo("admin");
        assertThat(jwtService.extractUsername(token, false)).isEqualTo("admin");
        assertThat(jwtService.extractUserId(token, false)).isEqualTo(1L);
        assertThat(jwtService.extractRole(token)).isEqualTo("Admin");
    }

    @Test
    @DisplayName("Should recognize expired token as invalid")
    void testTokenExpiry() throws InterruptedException {
        JwtProperties shortLivedProps = new JwtProperties(TEST_SECRET, TEST_REFRESH_SECRET, 1L, 604800000L);
        JwtService shortLivedJwtService = new JwtService(shortLivedProps);

        String expiredToken = shortLivedJwtService.generateAccessToken(testUser);

        // Sleep to ensure token has expired
        Thread.sleep(15);

        boolean isValid = shortLivedJwtService.isTokenValid(expiredToken, false);
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Should generate and parse refresh token containing tokenId")
    void testRefreshToken() {
        String tokenId = "token-uuid-12345";
        String refreshToken = jwtService.generateRefreshToken(testUser, tokenId);

        assertThat(refreshToken).isNotBlank();
        assertThat(jwtService.isTokenValid(refreshToken, true)).isTrue();

        Claims claims = jwtService.parseToken(refreshToken, true);
        assertThat(claims.getSubject()).isEqualTo("admin");
        assertThat(jwtService.extractTokenId(refreshToken)).isEqualTo(tokenId);
    }
}
