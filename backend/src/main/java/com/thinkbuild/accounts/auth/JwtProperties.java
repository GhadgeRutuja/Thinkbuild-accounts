package com.thinkbuild.accounts.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        String secret,
        String refreshSecret,
        long accessExpiryMs,
        long refreshExpiryMs
) {
}
