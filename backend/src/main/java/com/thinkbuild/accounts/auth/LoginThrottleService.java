package com.thinkbuild.accounts.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginThrottleService {

    private static final String KEY_PREFIX = "login_fail:";
    private final StringRedisTemplate redisTemplate;

    @Value("${app.security.max-failed-attempts:5}")
    private int maxFailedAttempts = 5;

    @Value("${app.security.lock-duration-minutes:5}")
    private int lockDurationMinutes = 5;

    public void recordFailure(String username) {
        String key = KEY_PREFIX + username;
        Long attempts = redisTemplate.opsForValue().increment(key);
        if (attempts != null && attempts == 1) {
            redisTemplate.expire(key, Duration.ofMinutes(lockDurationMinutes));
        } else if (attempts != null && attempts >= maxFailedAttempts) {
            redisTemplate.expire(key, Duration.ofMinutes(lockDurationMinutes));
        }
        log.warn("Login failure recorded for user '{}'. Total failed attempts: {}", username, attempts);
    }

    public boolean isLocked(String username) {
        String key = KEY_PREFIX + username;
        String val = redisTemplate.opsForValue().get(key);
        if (val == null) {
            return false;
        }
        try {
            int attempts = Integer.parseInt(val);
            return attempts >= maxFailedAttempts;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public void reset(String username) {
        String key = KEY_PREFIX + username;
        redisTemplate.delete(key);
        log.debug("Login throttle reset for user '{}'", username);
    }
}
