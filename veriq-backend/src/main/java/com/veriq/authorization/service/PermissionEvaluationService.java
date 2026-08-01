package com.veriq.authorization.service;

import java.util.Set;
import java.util.UUID;

public interface PermissionEvaluationService {

    boolean hasPermission(UUID userId, UUID organizationId, String permissionCode);

    boolean hasAnyPermission(UUID userId, UUID organizationId, String... permissionCodes);

    boolean hasAllPermissions(UUID userId, UUID organizationId, String... permissionCodes);

    Set<String> getEffectivePermissions(UUID userId, UUID organizationId);
}
