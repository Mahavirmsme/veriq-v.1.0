package com.veriq.permission.service;

import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.permission.dto.PermissionDTO;
import com.veriq.permission.entity.Permission;
import com.veriq.permission.mapper.PermissionMapper;
import com.veriq.permission.repository.PermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    public PermissionServiceImpl(PermissionRepository permissionRepository,
                                 PermissionMapper permissionMapper) {
        this.permissionRepository = permissionRepository;
        this.permissionMapper = permissionMapper;
    }

    @Override
    public List<PermissionDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PermissionDTO getPermissionById(UUID id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "id", id));
        return permissionMapper.toDto(permission);
    }

    @Override
    public PermissionDTO getPermissionByCode(String code) {
        Permission permission = permissionRepository.findByPermissionCode(code.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Permission", "permissionCode", code));
        return permissionMapper.toDto(permission);
    }

    @Override
    public List<PermissionDTO> getPermissionsByCategory(String category) {
        return permissionRepository.findByCategory(category.trim().toUpperCase()).stream()
                .map(permissionMapper::toDto)
                .collect(Collectors.toList());
    }
}
