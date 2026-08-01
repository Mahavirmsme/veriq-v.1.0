package com.veriq.auditlog.event;

import com.veriq.auditlog.service.AuditLogService;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class AuditEventListener {

    private final AuditLogService auditLogService;

    public AuditEventListener(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @EventListener
    public void handleAuditEvent(AuditEvent event) {
        if (event != null && event.getPayload() != null) {
            auditLogService.logEvent(event.getPayload());
        }
    }
}
