package com.veriq.authorization.service;

import com.veriq.authorization.context.UserContextHolder;
import com.veriq.authorization.dto.EffectivePermissionDTO;
import com.veriq.authorization.exception.ForbiddenException;
import com.veriq.common.context.TenantContextResolver;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.permission.repository.PermissionRepository;
import com.veriq.role.entity.Role;
import com.veriq.rolepermission.entity.RolePermission;
import com.veriq.rolepermission.repository.RolePermissionRepository;
import com.veriq.user.entity.User;
import com.veriq.user.repository.UserRepository;
import com.veriq.userrole.entity.UserRole;
import com.veriq.userrole.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class EffectivePermissionServiceImpl implements EffectivePermissionService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;
    private final TenantContextResolver tenantContextResolver;

    public EffectivePermissionServiceImpl(UserRepository userRepository,
                                          UserRoleRepository userRoleRepository,
                                          RolePermissionRepository rolePermissionRepository,
                                          PermissionRepository permissionRepository,
                                          TenantContextResolver tenantContextResolver) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Override
    public EffectivePermissionDTO getEffectivePermissionsForUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Tenant Isolation Check
        Optional<UUID> tenantOrgId = tenantContextResolver.resolveCurrentOrganizationId();
        if (tenantOrgId.isPresent() && !tenantOrgId.get().equals(user.getOrganizationId())) {
            throw new ResourceNotFoundException("User", "id", userId);
        }

        List<UserRole> userRoles = userRoleRepository.findByUserId(userId);

        Set<String> assignedRoleCodes = new HashSet<>();
        Set<String> uniquePermissions = new HashSet<>();
        boolean isSystemAdmin = false;

        for (UserRole ur : userRoles) {
            Role role = ur.getRole();
            if (role == null) {
                continue;
            }

            if (role.isSystemRole() && "SYSTEM_ADMIN".equalsIgnoreCase(role.getRoleCode())) {
                isSystemAdmin = true;
            }

            boolean isEligible = false;
            if (role.isSystemRole()) {
                isEligible = true;
            } else if (user.getOrganizationId() != null && user.getOrganizationId().equals(role.getOrganizationId())) {
                isEligible = true;
            }

            if (isEligible) {
                assignedRoleCodes.add(role.getRoleCode());

                List<RolePermission> rps = rolePermissionRepository.findByRoleId(role.getId());
                for (RolePermission rp : rps) {
                    if (rp.getPermission() != null) {
                        uniquePermissions.add(rp.getPermission().getPermissionCode());
                    }
                }
            }
        }

        if (isSystemAdmin) {
            permissionRepository.findAll().forEach(p -> uniquePermissions.add(p.getPermissionCode()));
        }

        List<String> sortedRoles = assignedRoleCodes.stream().sorted().collect(Collectors.toList());
        List<String> sortedPermissions = uniquePermissions.stream().sorted().collect(Collectors.toList());

        String fullName = (user.getFirstName() != null ? user.getFirstName() : "")
                + (user.getLastName() != null ? " " + user.getLastName() : "");

        return new EffectivePermissionDTO(
                user.getId(),
                user.getEmail(),
                fullName.trim(),
                user.getOrganizationId(),
                sortedRoles,
                sortedPermissions
        );
    }

    @Override
    public EffectivePermissionDTO getEffectivePermissionsForCurrentUser() {
        UUID currentUserId = UserContextHolder.getCurrentUserId()
                .orElseThrow(() -> new ForbiddenException("UNAUTHENTICATED", "Authentication context required to resolve current effective permissions."));

        return getEffectivePermissionsForUser(currentUserId);
    }
}
