package com.veriq.rolepermission.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.permission.entity.Permission;
import com.veriq.permission.repository.PermissionRepository;
import com.veriq.role.entity.Role;
import com.veriq.role.repository.RoleRepository;
import com.veriq.rolepermission.dto.CreateRolePermissionPayloadDTO;
import com.veriq.rolepermission.dto.RolePermissionDTO;
import com.veriq.rolepermission.entity.RolePermission;
import com.veriq.rolepermission.mapper.RolePermissionMapper;
import com.veriq.rolepermission.repository.RolePermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RolePermissionServiceImpl implements RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionMapper rolePermissionMapper;

    public RolePermissionServiceImpl(RolePermissionRepository rolePermissionRepository,
                                      RoleRepository roleRepository,
                                      PermissionRepository permissionRepository,
                                      RolePermissionMapper rolePermissionMapper) {
        this.rolePermissionRepository = rolePermissionRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.rolePermissionMapper = rolePermissionMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolePermissionDTO> getAllRolePermissions() {
        return rolePermissionRepository.findAll().stream()
                .map(rolePermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RolePermissionDTO getRolePermissionById(UUID id) {
        RolePermission entity = rolePermissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RolePermission", "id", id));
        return rolePermissionMapper.toDto(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolePermissionDTO> getRolePermissionsByRoleId(UUID roleId) {
        return rolePermissionRepository.findByRoleId(roleId).stream()
                .map(rolePermissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public RolePermissionDTO createRolePermission(CreateRolePermissionPayloadDTO payload) {
        Role role = roleRepository.findById(payload.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", payload.getRoleId()));

        Permission permission = permissionRepository.findById(payload.getPermissionId())
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", payload.getPermissionId()));

        if (rolePermissionRepository.existsByRoleIdAndPermissionId(payload.getRoleId(), payload.getPermissionId())) {
            throw new BusinessRuleViolationException("ROLE_PERMISSION_EXISTS", "Mapping between this Role and Permission already exists.");
        }

        RolePermission rp = new RolePermission();
        rp.setRole(role);
        rp.setPermission(permission);

        RolePermission saved = rolePermissionRepository.save(rp);
        return rolePermissionMapper.toDto(saved);
    }

    @Override
    public RolePermissionDTO updateRolePermission(UUID id, CreateRolePermissionPayloadDTO payload) {
        RolePermission rp = rolePermissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RolePermission", "id", id));

        Role role = roleRepository.findById(payload.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", payload.getRoleId()));

        Permission permission = permissionRepository.findById(payload.getPermissionId())
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", payload.getPermissionId()));

        rp.setRole(role);
        rp.setPermission(permission);

        RolePermission saved = rolePermissionRepository.save(rp);
        return rolePermissionMapper.toDto(saved);
    }

    @Override
    public void deleteRolePermission(UUID id) {
        RolePermission rp = rolePermissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RolePermission", "id", id));

        rolePermissionRepository.delete(rp);
    }
}
