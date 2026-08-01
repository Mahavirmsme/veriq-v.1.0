package com.veriq.auditlog.controller;

import com.veriq.auditlog.dto.AuditLogDTO;
import com.veriq.auditlog.dto.CreateAuditLogPayloadDTO;
import com.veriq.auditlog.event.AuditEvent;
import com.veriq.auditlog.service.AuditLogService;
import com.veriq.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit-logs/test")
@CrossOrigin(origins = "*")
public class AuditLogTestController {

    private final AuditLogService auditLogService;
    private final ApplicationEventPublisher eventPublisher;

    public AuditLogTestController(AuditLogService auditLogService, ApplicationEventPublisher eventPublisher) {
        this.auditLogService = auditLogService;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping("/publish")
    public ResponseEntity<ApiResponse<AuditLogDTO>> publishAuditEvent(@Valid @RequestBody CreateAuditLogPayloadDTO payload) {
        eventPublisher.publishEvent(new AuditEvent(this, payload));
        AuditLogDTO dto = auditLogService.logEvent(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Audit event logged successfully"));
    }
}
