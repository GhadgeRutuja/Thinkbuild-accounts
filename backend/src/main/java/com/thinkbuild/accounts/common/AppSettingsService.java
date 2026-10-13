package com.thinkbuild.accounts.common;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppSettingsService {

    private final AppSettingsRepository appSettingsRepository;

    public Optional<String> getValue(String key) {
        return appSettingsRepository.findValueByKey(key);
    }

    public int getIntValue(String key, int defaultValue) {
        return getValue(key)
                .map(val -> {
                    try {
                        return Integer.parseInt(val.trim());
                    } catch (NumberFormatException e) {
                        log.warn("Invalid integer value for setting {}: '{}'. Using default: {}", key, val, defaultValue);
                        return defaultValue;
                    }
                })
                .orElse(defaultValue);
    }

    public int getDecimalScale() {
        return getIntValue("decimals", 3);
    }
}
