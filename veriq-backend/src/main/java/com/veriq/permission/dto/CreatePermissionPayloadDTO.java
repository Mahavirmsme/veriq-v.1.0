package com.veriq.permission.dto;

import jakarta.validation.constraints.NotBlank;

public class CreatePermissionPayloadDTO {

    @NotBlank(message = "Permission code is required")
    private String permissionCode;

    @NotBlank(message = "Permission name is required")
    private String permissionName;

    private String permissionDescription;

    public CreatePermissionPayloadDTO() {}

    public String getPermissionCode() {
        return permissionCode;
    }

    public void setPermissionCode(String permissionCode) {
        this.permissionCode = permissionCode;
    }

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
