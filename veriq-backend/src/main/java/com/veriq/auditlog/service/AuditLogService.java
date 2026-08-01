package com.veriq.auditlog.service;

import com.veriq.auditlog.dto.AuditLogDTO;
import com.veriq.auditlog.dto.CreateAuditLogPayloadDTO;

import java.util.List;
import java.util.UUID;

public interface AuditLogService {
    AuditLogDTO logEvent(CreateAuditLogPayloadDTO payload);
    List<AuditLogDTO> getAllAuditLogs();
    AuditLogDTO getAuditLogById(UUID id);
    List<AuditLogDTO> getAuditLogsByUserId(UUID userId);
    List<AuditLogDTO> getAuditLogsByResource(String resourceType, String resourceId);
}
