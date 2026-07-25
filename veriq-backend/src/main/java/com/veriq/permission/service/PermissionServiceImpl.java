package com.veriq.permission.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.permission.dto.CreatePermissionPayloadDTO;
import com.veriq.permission.dto.PermissionDTO;
import com.veriq.permission.dto.UpdatePermissionPayloadDTO;
import com.veriq.permission.entity.Permission;
import com.veriq.permission.mapper.PermissionMapper;
import com.veriq.permission.repository.PermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    public PermissionServiceImpl(PermissionRepository permissionRepository, PermissionMapper permissionMapper) {
        this.permissionRepository = permissionRepository;
        this.permissionMapper = permissionMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionDTO getPermissionById(UUID id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", id));
        return permissionMapper.toDto(permission);
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionDTO getPermissionByCode(String permissionCode) {
        Permission permission = permissionRepository.findByPermissionCode(permissionCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "permissionCode", permissionCode));
        return permissionMapper.toDto(permission);
    }

    @Override
    public PermissionDTO createPermission(CreatePermissionPayloadDTO payload) {
        String code = payload.getPermissionCode().trim().toUpperCase();
        if (permissionRepository.existsByPermissionCode(code)) {
            throw new BusinessRuleViolationException("PERMISSION_CODE_EXISTS", "A permission with code '" + code + "' already exists.");
        }
        Permission permission = permissionMapper.toEntity(payload);
        Permission saved = permissionRepository.save(permission);
        return permissionMapper.toDto(saved);
    }

    @Override
    public PermissionDTO updatePermission(UUID id, UpdatePermissionPayloadDTO payload) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", id));
        
        permission.setPermissionName(payload.getPermissionName().trim());
        permission.setPermissionDescription(payload.getPermissionDescription());

        Permission saved = permissionRepository.save(permission);
        return permissionMapper.toDto(saved);
    }

    @Override
    public void deletePermission(UUID id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", id));

        permissionRepository.delete(permission);
    }
}
