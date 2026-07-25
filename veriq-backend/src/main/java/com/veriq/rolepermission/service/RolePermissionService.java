package com.veriq.rolepermission.service;

import com.veriq.rolepermission.dto.CreateRolePermissionPayloadDTO;
import com.veriq.rolepermission.dto.RolePermissionDTO;

import java.util.List;
import java.util.UUID;

public interface RolePermissionService {
    List<RolePermissionDTO> getAllRolePermissions();
    RolePermissionDTO getRolePermissionById(UUID id);
    List<RolePermissionDTO> getRolePermissionsByRoleId(UUID roleId);
    RolePermissionDTO createRolePermission(CreateRolePermissionPayloadDTO payload);
    RolePermissionDTO updateRolePermission(UUID id, CreateRolePermissionPayloadDTO payload);
    void deleteRolePermission(UUID id);
}
