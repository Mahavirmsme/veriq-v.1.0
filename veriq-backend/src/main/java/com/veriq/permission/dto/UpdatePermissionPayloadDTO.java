package com.veriq.permission.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdatePermissionPayloadDTO {

    @NotBlank(message = "Permission name is required")
    private String permissionName;

    private String permissionDescription;

    public UpdatePermissionPayloadDTO() {}

    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public String getPermissionDescription() {
        return permissionDescription;
    }

    public void setPermissionDescription(String permissionDescription) {
        this.permissionDescription = permissionDescription;
    }
}
