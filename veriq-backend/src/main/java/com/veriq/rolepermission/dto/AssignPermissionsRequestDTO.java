package com.veriq.rolepermission.dto;

import java.util.List;
import java.util.UUID;

public class AssignPermissionsRequestDTO {

    private List<UUID> permissionIds;
    private List<String> permissionCodes;

    public AssignPermissionsRequestDTO() {}

    public AssignPermissionsRequestDTO(List<UUID> permissionIds) {
        this.permissionIds = permissionIds;
    }

    public List<UUID> getPermissionIds() {
        return permissionIds;
    }

    public void setPermissionIds(List<UUID> permissionIds) {
        this.permissionIds = permissionIds;
    }

    public List<String> getPermissionCodes() {
        return permissionCodes;
    }

    public void setPermissionCodes(List<String> permissionCodes) {
        this.permissionCodes = permissionCodes;
    }
}
