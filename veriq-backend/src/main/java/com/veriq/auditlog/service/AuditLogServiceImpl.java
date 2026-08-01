package com.veriq.auditlog.service;

import com.veriq.auditlog.dto.AuditLogDTO;
import com.veriq.auditlog.dto.CreateAuditLogPayloadDTO;
import com.veriq.auditlog.entity.AuditLog;
import com.veriq.auditlog.mapper.AuditLogMapper;
import com.veriq.auditlog.repository.AuditLogRepository;
import com.veriq.authorization.context.UserContextHolder;
import com.veriq.common.context.TenantContextResolver;
import com.veriq.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;
    private final TenantContextResolver tenantContextResolver;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository,
                               AuditLogMapper auditLogMapper,
                               TenantContextResolver tenantContextResolver) {
        this.auditLogRepository = auditLogRepository;
        this.auditLogMapper = auditLogMapper;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Override
    public AuditLogDTO logEvent(CreateAuditLogPayloadDTO payload) {
        UUID userId = payload.getUserId() != null
                ? payload.getUserId()
                : UserContextHolder.getCurrentUserId().orElse(null);

        UUID orgId = payload.getOrganizationId() != null
                ? payload.getOrganizationId()
                : tenantContextResolver.resolveCurrentOrganizationId().orElse(null);

        AuditLog log = new AuditLog(
                userId,
                orgId,
                payload.getAction(),
                payload.getResourceType(),
                payload.getResourceId(),
                payload.getResult(),
                payload.getIpAddress(),
                payload.getUserAgent(),
                payload.getDetails()
        );

        AuditLog saved = auditLogRepository.save(log);
        return auditLogMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAllAuditLogs() {
        Optional<UUID> currentOrgId = tenantContextResolver.resolveCurrentOrganizationId();

        if (currentOrgId.isPresent()) {
            return auditLogRepository.findByOrganizationId(currentOrgId.get()).stream()
                    .map(auditLogMapper::toDto)
                    .collect(Collectors.toList());
        }

        return auditLogRepository.findAll().stream()
                .map(auditLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AuditLogDTO getAuditLogById(UUID id) {
        AuditLog log = auditLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AuditLog", "id", id));

        Optional<UUID> currentOrgId = tenantContextResolver.resolveCurrentOrganizationId();
        if (currentOrgId.isPresent() && log.getOrganizationId() != null && !currentOrgId.get().equals(log.getOrganizationId())) {
            throw new ResourceNotFoundException("AuditLog", "id", id);
        }

        return auditLogMapper.toDto(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogsByUserId(UUID userId) {
        Optional<UUID> currentOrgId = tenantContextResolver.resolveCurrentOrganizationId();

        if (currentOrgId.isPresent()) {
            return auditLogRepository.findByOrganizationIdAndUserId(currentOrgId.get(), userId).stream()
                    .map(auditLogMapper::toDto)
                    .collect(Collectors.toList());
        }

        return auditLogRepository.findByUserId(userId).stream()
                .map(auditLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogsByResource(String resourceType, String resourceId) {
        Optional<UUID> currentOrgId = tenantContextResolver.resolveCurrentOrganizationId();

        if (currentOrgId.isPresent()) {
            return auditLogRepository.findByOrganizationIdAndResourceTypeAndResourceId(currentOrgId.get(), resourceType, resourceId).stream()
                    .map(auditLogMapper::toDto)
                    .collect(Collectors.toList());
        }

        return auditLogRepository.findByResourceTypeAndResourceId(resourceType, resourceId).stream()
                .map(auditLogMapper::toDto)
                .collect(Collectors.toList());
    }
}
