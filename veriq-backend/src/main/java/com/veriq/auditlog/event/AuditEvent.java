package com.veriq.auditlog.event;

import com.veriq.auditlog.dto.CreateAuditLogPayloadDTO;
import org.springframework.context.ApplicationEvent;

public class AuditEvent extends ApplicationEvent {

    private final CreateAuditLogPayloadDTO payload;

    public AuditEvent(Object source, CreateAuditLogPayloadDTO payload) {
        super(source);
        this.payload = payload;
    }

    public CreateAuditLogPayloadDTO getPayload() {
        return payload;
    }
}
