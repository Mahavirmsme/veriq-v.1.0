package com.veriq.auditlog.mapper;

import com.veriq.auditlog.dto.AuditLogDTO;
import com.veriq.auditlog.entity.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLogDTO toDto(AuditLog entity) {
        if (entity == null) {
            return null;
        }
        AuditLogDTO dto = new AuditLogDTO();
        dto.setId(entity.getId());
        dto.setTimestamp(entity.getTimestamp());
        dto.setUserId(entity.getUserId());
        dto.setOrganizationId(entity.getOrganizationId());
        dto.setAction(entity.getAction());
        dto.setResourceType(entity.getResourceType());
        dto.setResourceId(entity.getResourceId());
        dto.setResult(entity.getResult());
        dto.setIpAddress(entity.getIpAddress());
        dto.setUserAgent(entity.getUserAgent());
        dto.setDetails(entity.getDetails());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
