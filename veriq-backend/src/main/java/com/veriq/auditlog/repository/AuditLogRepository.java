package com.veriq.auditlog.repository;

import com.veriq.auditlog.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findByOrganizationId(UUID organizationId);
    List<AuditLog> findByUserId(UUID userId);
    List<AuditLog> findByResourceTypeAndResourceId(String resourceType, String resourceId);
    List<AuditLog> findByOrganizationIdAndUserId(UUID organizationId, UUID userId);
    List<AuditLog> findByOrganizationIdAndResourceTypeAndResourceId(UUID organizationId, String resourceType, String resourceId);
}
