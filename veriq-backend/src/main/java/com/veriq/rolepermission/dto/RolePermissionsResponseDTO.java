package com.veriq.rolepermission.dto;

import com.veriq.permission.dto.PermissionDTO;
import java.util.List;
import java.util.UUID;

public class RolePermissionsResponseDTO {

    private UUID roleId;
    private String roleCode;
    private String roleName;
    private boolean isSystemRole;
    private UUID organizationId;
    private List<PermissionDTO> permissions;

    public RolePermissionsResponseDTO() {}

    public RolePermissionsResponseDTO(UUID roleId, String roleCode, String roleName, boolean isSystemRole, UUID organizationId, List<PermissionDTO> permissions) {
        this.roleId = roleId;
        this.roleCode = roleCode;
        this.roleName = roleName;
        this.isSystemRole = isSystemRole;
        this.organizationId = organizationId;
        this.permissions = permissions;
    }

    public UUID getRoleId() {
        return roleId;
    }

    public void setRoleId(UUID roleId) {
        this.roleId = roleId;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public boolean isSystemRole() {
        return isSystemRole;
    }

    public void setSystemRole(boolean systemRole) {
        isSystemRole = systemRole;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(UUID organizationId) {
        this.organizationId = organizationId;
    }

    public List<PermissionDTO> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionDTO> permissions) {
        this.permissions = permissions;
    }
}
