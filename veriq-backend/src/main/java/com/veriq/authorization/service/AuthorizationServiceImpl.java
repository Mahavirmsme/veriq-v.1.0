package com.veriq.authorization.service;

import com.veriq.authorization.dto.AuthorizationRequestDTO;
import com.veriq.authorization.dto.AuthorizationResponseDTO;
import com.veriq.permission.repository.PermissionRepository;
import com.veriq.rolepermission.entity.RolePermission;
import com.veriq.rolepermission.repository.RolePermissionRepository;
import com.veriq.userrole.entity.UserRole;
import com.veriq.userrole.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AuthorizationServiceImpl implements AuthorizationService {

    private final UserRoleRepository userRoleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;

    public AuthorizationServiceImpl(UserRoleRepository userRoleRepository,
                                     RolePermissionRepository rolePermissionRepository,
                                     PermissionRepository permissionRepository) {
        this.userRoleRepository = userRoleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public AuthorizationResponseDTO authorize(AuthorizationRequestDTO request) {
        UUID userId = request.getUserId();

        List<UserRole> userRoles = userRoleRepository.findByUserId(userId);

        Set<String> assignedRoleCodes = new HashSet<>();
        Set<UUID> roleIds = new HashSet<>();

        for (UserRole ur : userRoles) {
            if (ur.getRole() != null) {
                assignedRoleCodes.add(ur.getRole().getRoleCode());
                roleIds.add(ur.getRole().getId());
            }
        }

        // If no explicit user_roles found, default to ADMIN role for System Administrator
        if (assignedRoleCodes.isEmpty()) {
            assignedRoleCodes.add("ADMIN");
        }

        Set<String> grantedPermissionCodes = new HashSet<>();

        if (assignedRoleCodes.contains("ADMIN")) {
            // ADMIN has all permissions
            permissionRepository.findAll().forEach(p -> grantedPermissionCodes.add(p.getPermissionCode()));
            if (grantedPermissionCodes.isEmpty()) {
                grantedPermissionCodes.addAll(Arrays.asList(
                    "ADMINISTRATION", "CONFIGURATION", "OPERATIONS",
                    "VIEW_REPORTS", "MANAGE_USERS", "MANAGE_ROLES"
                ));
            }
        } else {
            for (UUID roleId : roleIds) {
                List<RolePermission> rps = rolePermissionRepository.findByRoleId(roleId);
                for (RolePermission rp : rps) {
                    if (rp.getPermission() != null) {
                        grantedPermissionCodes.add(rp.getPermission().getPermissionCode());
                    }
                }
            }
        }

        List<String> sortedRoles = assignedRoleCodes.stream().sorted().collect(Collectors.toList());
        List<String> sortedPermissions = grantedPermissionCodes.stream().sorted().collect(Collectors.toList());

        return new AuthorizationResponseDTO(userId, sortedRoles, sortedPermissions);
    }
}
