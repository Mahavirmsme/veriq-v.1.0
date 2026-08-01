package com.veriq.rolepermission.dto;

import com.veriq.role.dto.RoleDTO;
import java.util.List;
import java.util.UUID;

public class PermissionRolesResponseDTO {

    private UUID permissionId;
    private String permissionCode;
    private String category;
    private String displayName;
    private List<RoleDTO> roles;

    public PermissionRolesResponseDTO() {}

    public PermissionRolesResponseDTO(UUID permissionId, String permissionCode, String category, String displayName, List<RoleDTO> roles) {
        this.permissionId = permissionId;
        this.permissionCode = permissionCode;
        this.category = category;
        this.displayName = displayName;
        this.roles = roles;
    }

    public UUID getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(UUID permissionId) {
        this.permissionId = permissionId;
    }

    public String getPermissionCode() {
        return permissionCode;
    }

    public void setPermissionCode(String permissionCode) {
        this.permissionCode = permissionCode;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public List<RoleDTO> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }
}
