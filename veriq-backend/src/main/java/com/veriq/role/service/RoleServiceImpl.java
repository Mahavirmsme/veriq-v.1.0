package com.veriq.role.service;

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

    public RoleServiceImpl(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleDTO getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));
        return roleMapper.toDto(role);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleDTO getRoleByCode(String roleCode) {
        Role role = roleRepository.findByRoleCode(roleCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Role", "roleCode", roleCode));
        return roleMapper.toDto(role);
    }

    @Override
    public RoleDTO createRole(CreateRolePayloadDTO payload) {
        String code = payload.getRoleCode().trim().toUpperCase();
        if (roleRepository.existsByRoleCode(code)) {
            throw new BusinessRuleViolationException("ROLE_CODE_EXISTS", "A role with code '" + code + "' already exists.");
        }
        Role role = roleMapper.toEntity(payload);
        Role saved = roleRepository.save(role);
        return roleMapper.toDto(saved);
    }

    @Override
    public RoleDTO updateRole(UUID id, UpdateRolePayloadDTO payload) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));
        
        role.setRoleName(payload.getRoleName().trim());
        role.setRoleDescription(payload.getRoleDescription());

        Role saved = roleRepository.save(role);
        return roleMapper.toDto(saved);
    }

    @Override
    public void deleteRole(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));

        if (role.isSystemRole()) {
            throw new BusinessRuleViolationException("SYSTEM_ROLE_DELETE_RESTRICTED", "System roles cannot be deleted.");
        }

        roleRepository.delete(role);
    }
}
