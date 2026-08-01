package com.veriq.rolepermission.service;

import com.veriq.common.context.TenantContextResolver;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.permission.dto.PermissionDTO;
import com.veriq.permission.entity.Permission;
import com.veriq.permission.mapper.PermissionMapper;
import com.veriq.permission.repository.PermissionRepository;
import com.veriq.role.dto.RoleDTO;
import com.veriq.role.entity.Role;
import com.veriq.role.mapper.RoleMapper;
import com.veriq.role.repository.RoleRepository;
import com.veriq.rolepermission.dto.*;
import com.veriq.rolepermission.entity.RolePermission;
import com.veriq.rolepermission.mapper.RolePermissionMapper;
import com.veriq.rolepermission.repository.RolePermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RolePermissionServiceImpl implements RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionMapper rolePermissionMapper;
    private final PermissionMapper permissionMapper;
    private final RoleMapper roleMapper;
    private final TenantContextResolver tenantContextResolver;

    public RolePermissionServiceImpl(RolePermissionRepository rolePermissionRepository,
                                      RoleRepository roleRepository,
                                      PermissionRepository permissionRepository,
                                      RolePermissionMapper rolePermissionMapper,
                                      PermissionMapper permissionMapper,
                                      RoleMapper roleMapper,
                                      TenantContextResolver tenantContextResolver) {
        this.rolePermissionRepository = rolePermissionRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.rolePermissionMapper = rolePermissionMapper;
        this.permissionMapper = permissionMapper;
        this.roleMapper = roleMapper;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Override
    public RolePermissionsResponseDTO assignPermissionsToRole(UUID roleId, AssignPermissionsRequestDTO request) {
        Role role = resolveRole(roleId);
        validateRoleMutation(role);

        List<Permission> permissionsToAssign = new ArrayList<>();

        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            for (UUID pId : request.getPermissionIds()) {
                Permission p = permissionRepository.findById(pId)
                        .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", pId));
                permissionsToAssign.add(p);
            }
        }

        if (request.getPermissionCodes() != null && !request.getPermissionCodes().isEmpty()) {
            for (String code : request.getPermissionCodes()) {
                Permission p = permissionRepository.findByPermissionCode(code.trim())
                        .orElseThrow(() -> new ResourceNotFoundException("Permission", "permissionCode", code));
                if (!permissionsToAssign.contains(p)) {
                    permissionsToAssign.add(p);
                }
            }
        }

        for (Permission permission : permissionsToAssign) {
            if (!rolePermissionRepository.existsByRoleIdAndPermissionId(role.getId(), permission.getId())) {
                RolePermission mapping = new RolePermission(role, permission);
                rolePermissionRepository.save(mapping);
            }
        }

        return getPermissionsForRole(role.getId());
    }

    @Override
    public RolePermissionDTO assignSinglePermissionToRole(UUID roleId, UUID permissionId) {
        Role role = resolveRole(roleId);
        validateRoleMutation(role);

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", permissionId));

        Optional<RolePermission> existing = rolePermissionRepository.findByRoleIdAndPermissionId(roleId, permissionId);
        if (existing.isPresent()) {
            return rolePermissionMapper.toDto(existing.get());
        }

        RolePermission mapping = new RolePermission(role, permission);
        RolePermission saved = rolePermissionRepository.save(mapping);
        return rolePermissionMapper.toDto(saved);
    }

    @Override
    public void removePermissionFromRole(UUID roleId, UUID permissionId) {
        Role role = resolveRole(roleId);
        validateRoleMutation(role);

        if (!permissionRepository.existsById(permissionId)) {
            throw new ResourceNotFoundException("Permission", "id", permissionId);
        }

        rolePermissionRepository.deleteByRoleIdAndPermissionId(roleId, permissionId);
    }

    @Override
    public void removePermissionsFromRole(UUID roleId, List<UUID> permissionIds) {
        Role role = resolveRole(roleId);
        validateRoleMutation(role);

        if (permissionIds != null) {
            for (UUID pId : permissionIds) {
                rolePermissionRepository.deleteByRoleIdAndPermissionId(roleId, pId);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RolePermissionsResponseDTO getPermissionsForRole(UUID roleId) {
        Role role = resolveRole(roleId);

        List<PermissionDTO> assignedPermissions = rolePermissionRepository.findByRoleId(roleId).stream()
                .map(RolePermission::getPermission)
                .map(permissionMapper::toDto)
                .collect(Collectors.toList());

        return new RolePermissionsResponseDTO(
                role.getId(),
                role.getRoleCode(),
                role.getRoleName(),
                role.isSystemRole(),
                role.getOrganizationId(),
                assignedPermissions
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionRolesResponseDTO getRolesForPermission(UUID permissionId) {
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", permissionId));

        Optional<UUID> tenantOrgId = tenantContextResolver.resolveCurrentOrganizationId();

        List<RoleDTO> matchingRoles = rolePermissionRepository.findByPermissionId(permissionId).stream()
                .map(RolePermission::getRole)
                .filter(r -> {
                    if (r.isSystemRole()) {
                        return true;
                    }
                    return tenantOrgId.map(orgId -> orgId.equals(r.getOrganizationId())).orElse(true);
                })
                .map(roleMapper::toDto)
                .collect(Collectors.toList());

        return new PermissionRolesResponseDTO(
                permission.getId(),
                permission.getPermissionCode(),
                permission.getCategory(),
                permission.getDisplayName(),
                matchingRoles
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolePermissionDTO> getAllRolePermissions() {
        Optional<UUID> tenantOrgId = tenantContextResolver.resolveCurrentOrganizationId();

        return rolePermissionRepository.findAll().stream()
                .filter(rp -> {
                    Role r = rp.getRole();
                    if (r == null) return false;
                    if (r.isSystemRole()) return true;
                    return tenantOrgId.map(orgId -> orgId.equals(r.getOrganizationId())).orElse(true);
                })
                .map(rolePermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RolePermissionDTO getRolePermissionById(UUID id) {
        RolePermission rp = rolePermissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RolePermission", "id", id));
        resolveRole(rp.getRole().getId());
        return rolePermissionMapper.toDto(rp);
    }

    @Override
    public RolePermissionDTO createRolePermission(CreateRolePermissionPayloadDTO payload) {
        return assignSinglePermissionToRole(payload.getRoleId(), payload.getPermissionId());
    }

    @Override
    public void deleteRolePermission(UUID id) {
        RolePermission rp = rolePermissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RolePermission", "id", id));
        validateRoleMutation(rp.getRole());
        rolePermissionRepository.delete(rp);
    }

    private Role resolveRole(UUID roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

        if (!role.isSystemRole()) {
            Optional<UUID> currentOrgId = tenantContextResolver.resolveCurrentOrganizationId();
            if (currentOrgId.isPresent() && !currentOrgId.get().equals(role.getOrganizationId())) {
                throw new ResourceNotFoundException("Role", "id", roleId);
            }
        }
        return role;
    }

    private void validateRoleMutation(Role role) {
        if (role.isSystemRole()) {
            throw new BusinessRuleViolationException("SYSTEM_ROLE_PROTECTED",
                    "System roles are protected system templates and permissions cannot be modified.");
        }
    }
}
