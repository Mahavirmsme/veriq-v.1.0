package com.veriq.role.service;

import com.veriq.common.context.TenantContextResolver;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.role.dto.CreateRolePayloadDTO;
import com.veriq.role.dto.RoleDTO;
import com.veriq.role.dto.UpdateRolePayloadDTO;
import com.veriq.role.entity.Role;
import com.veriq.role.mapper.RoleMapper;
import com.veriq.role.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;
    private final TenantContextResolver tenantContextResolver;

    public RoleServiceImpl(RoleRepository roleRepository,
                           RoleMapper roleMapper,
                           TenantContextResolver tenantContextResolver) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleDTO> getAllRoles() {
        UUID organizationId = requireTenantContext();
        return roleRepository.findByOrganizationIdOrSystemRoleTrue(organizationId).stream()
                .map(roleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleDTO getRoleById(UUID id) {
        UUID organizationId = requireTenantContext();
        Role role = roleRepository.findByIdAndOrganizationIdOrSystemRole(id, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));
        return roleMapper.toDto(role);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleDTO getRoleByCode(String roleCode) {
        UUID organizationId = requireTenantContext();
        Role role = roleRepository.findByRoleCodeAndOrganizationIdOrSystemRole(roleCode.trim(), organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "roleCode", roleCode));
        return roleMapper.toDto(role);
    }

    @Override
    public RoleDTO createRole(CreateRolePayloadDTO payload) {
        UUID organizationId = requireTenantContext();
        String code = payload.getRoleCode().trim().toUpperCase();

        if (roleRepository.existsByRoleCodeAndOrganizationIdOrSystemRole(code, organizationId)) {
            throw new BusinessRuleViolationException("ROLE_CODE_EXISTS",
                    "A role with code '" + code + "' already exists in this organization.");
        }

        Role role = roleMapper.toEntity(payload);
        role.setOrganizationId(organizationId);

        Role saved = roleRepository.save(role);
        return roleMapper.toDto(saved);
    }

    @Override
    public RoleDTO updateRole(UUID id, UpdateRolePayloadDTO payload) {
        UUID organizationId = requireTenantContext();
        Role role = roleRepository.findByIdAndOrganizationIdOrSystemRole(id, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));

        if (role.isSystemRole()) {
            throw new BusinessRuleViolationException("SYSTEM_ROLE_PROTECTED",
                    "System roles are protected and cannot be modified.");
        }

        role.setRoleName(payload.getRoleName().trim());
        if (payload.getRoleDescription() != null) {
            role.setRoleDescription(payload.getRoleDescription().trim());
        }
        if (payload.getStatus() != null) {
            role.setStatus(payload.getStatus());
        }

        Role saved = roleRepository.save(role);
        return roleMapper.toDto(saved);
    }

    @Override
    public void deleteRole(UUID id) {
        UUID organizationId = requireTenantContext();
        Role role = roleRepository.findByIdAndOrganizationIdOrSystemRole(id, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));

        if (role.isSystemRole()) {
            throw new BusinessRuleViolationException("SYSTEM_ROLE_PROTECTED",
                    "System roles are protected and cannot be deleted.");
        }

        roleRepository.delete(role);
    }

    private UUID requireTenantContext() {
        return tenantContextResolver.resolveCurrentOrganizationId()
                .orElseThrow(() -> new BusinessRuleViolationException("TENANT_CONTEXT_MISSING",
                        "Operation rejected: Active organization tenant context is required."));
    }
}
