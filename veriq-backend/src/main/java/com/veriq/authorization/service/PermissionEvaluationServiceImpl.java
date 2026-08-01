package com.veriq.authorization.service;

import com.veriq.permission.repository.PermissionRepository;
import com.veriq.role.entity.Role;
import com.veriq.rolepermission.entity.RolePermission;
import com.veriq.rolepermission.repository.RolePermissionRepository;
import com.veriq.userrole.entity.UserRole;
import com.veriq.userrole.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class PermissionEvaluationServiceImpl implements PermissionEvaluationService {

    private final UserRoleRepository userRoleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;

    public PermissionEvaluationServiceImpl(UserRoleRepository userRoleRepository,
                                           RolePermissionRepository rolePermissionRepository,
                                           PermissionRepository permissionRepository) {
        this.userRoleRepository = userRoleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public boolean hasPermission(UUID userId, UUID organizationId, String permissionCode) {
        if (userId == null || permissionCode == null || permissionCode.isBlank()) {
            return false;
        }
        Set<String> effectivePermissions = getEffectivePermissions(userId, organizationId);
        return effectivePermissions.contains(permissionCode.trim());
    }

    @Override
    public boolean hasAnyPermission(UUID userId, UUID organizationId, String... permissionCodes) {
        if (userId == null || permissionCodes == null || permissionCodes.length == 0) {
            return false;
        }
        Set<String> effectivePermissions = getEffectivePermissions(userId, organizationId);
        for (String code : permissionCodes) {
            if (code != null && effectivePermissions.contains(code.trim())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean hasAllPermissions(UUID userId, UUID organizationId, String... permissionCodes) {
        if (userId == null || permissionCodes == null || permissionCodes.length == 0) {
            return false;
        }
        Set<String> effectivePermissions = getEffectivePermissions(userId, organizationId);
        for (String code : permissionCodes) {
            if (code != null && !effectivePermissions.contains(code.trim())) {
                return false;
            }
        }
        return true;
    }

    @Override
    public Set<String> getEffectivePermissions(UUID userId, UUID organizationId) {
        if (userId == null) {
            return Collections.emptySet();
        }

        List<UserRole> userRoles = userRoleRepository.findByUserId(userId);
        Set<String> effectivePermissions = new HashSet<>();

        boolean isSystemAdmin = false;

        for (UserRole ur : userRoles) {
            Role role = ur.getRole();
            if (role == null) {
                continue;
            }

            // Check if System Admin role
            if (role.isSystemRole() && "SYSTEM_ADMIN".equalsIgnoreCase(role.getRoleCode())) {
                isSystemAdmin = true;
            }

            // Tenant isolation enforcement
            boolean isEligibleRole = false;
            if (role.isSystemRole()) {
                // System roles are globally applicable
                isEligibleRole = true;
            } else if (organizationId != null && organizationId.equals(role.getOrganizationId())) {
                // Custom Org role matching active tenant organization
                isEligibleRole = true;
            }

            if (isEligibleRole) {
                List<RolePermission> mappings = rolePermissionRepository.findByRoleId(role.getId());
                for (RolePermission rp : mappings) {
                    if (rp.getPermission() != null) {
                        effectivePermissions.add(rp.getPermission().getPermissionCode());
                    }
                }
            }
        }

        // If System Admin, grant all permissions in catalog
        if (isSystemAdmin) {
            permissionRepository.findAll().forEach(p -> effectivePermissions.add(p.getPermissionCode()));
        }

        return effectivePermissions;
    }
}
