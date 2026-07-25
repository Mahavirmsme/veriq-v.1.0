package com.veriq.permission.service;

import com.veriq.permission.dto.CreatePermissionPayloadDTO;
import com.veriq.permission.dto.PermissionDTO;
import com.veriq.permission.dto.UpdatePermissionPayloadDTO;

import java.util.List;
import java.util.UUID;

public interface PermissionService {
    List<PermissionDTO> getAllPermissions();
    PermissionDTO getPermissionById(UUID id);
    PermissionDTO getPermissionByCode(String permissionCode);
    PermissionDTO createPermission(CreatePermissionPayloadDTO payload);
    PermissionDTO updatePermission(UUID id, UpdatePermissionPayloadDTO payload);
    void deletePermission(UUID id);
}
