package com.veriq.rolepermission.service;

import com.veriq.rolepermission.dto.AssignPermissionsRequestDTO;
import com.veriq.rolepermission.dto.CreateRolePermissionPayloadDTO;
import com.veriq.rolepermission.dto.PermissionRolesResponseDTO;
import com.veriq.rolepermission.dto.RolePermissionDTO;
import com.veriq.rolepermission.dto.RolePermissionsResponseDTO;

import java.util.List;
import java.util.UUID;

public interface RolePermissionService {
    RolePermissionsResponseDTO assignPermissionsToRole(UUID roleId, AssignPermissionsRequestDTO request);
    RolePermissionDTO assignSinglePermissionToRole(UUID roleId, UUID permissionId);
    void removePermissionFromRole(UUID roleId, UUID permissionId);
    void removePermissionsFromRole(UUID roleId, List<UUID> permissionIds);
    RolePermissionsResponseDTO getPermissionsForRole(UUID roleId);
    PermissionRolesResponseDTO getRolesForPermission(UUID permissionId);
    List<RolePermissionDTO> getAllRolePermissions();
    RolePermissionDTO getRolePermissionById(UUID id);
    RolePermissionDTO createRolePermission(CreateRolePermissionPayloadDTO payload);
    void deleteRolePermission(UUID id);
}
