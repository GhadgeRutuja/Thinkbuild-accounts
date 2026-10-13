package com.thinkbuild.accounts.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final String KEY_PREFIX = "refresh:";
    private final StringRedisTemplate redisTemplate;

    public void store(Long userId, String tokenId, Duration ttl) {
        String key = buildKey(userId, tokenId);
        redisTemplate.opsForValue().set(key, "valid", ttl);
        log.debug("Stored refresh token in Redis with key: {}", key);
    }

    public boolean exists(Long userId, String tokenId) {
        String key = buildKey(userId, tokenId);
        Boolean hasKey = redisTemplate.hasKey(key);
        return Boolean.TRUE.equals(hasKey);
    }

    public void revoke(Long userId, String tokenId) {
        String key = buildKey(userId, tokenId);
        redisTemplate.delete(key);
        log.debug("Revoked refresh token key: {}", key);
    }

    public void revokeAll(Long userId) {
        String pattern = KEY_PREFIX + userId + ":*";
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.debug("Revoked {} refresh tokens for user: {}", keys.size(), userId);
        }
    }

    private String buildKey(Long userId, String tokenId) {
        return KEY_PREFIX + userId + ":" + tokenId;
    }
}
