package com.thinkbuild.accounts.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @Async
    public void log(Long userId, String action, String entity, String entityId, Object details, String ip) {
        try {
            String detailsJson = null;
            if (details != null) {
                if (details instanceof String str) {
                    detailsJson = str;
                } else {
                    detailsJson = objectMapper.writeValueAsString(details);
                }
            }

            AuditLog logEntry = AuditLog.builder()
                    .userId(userId)
                    .action(action)
                    .entity(entity)
                    .entityId(entityId)
                    .details(detailsJson)
                    .ip(ip)
                    .createdAt(Instant.now())
                    .build();

            auditLogRepository.save(logEntry);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize audit log details for entity {}: {}", entity, e.getMessage());
        } catch (Exception e) {
            log.error("Failed to save audit log entry: {}", e.getMessage(), e);
        }
    }
}
