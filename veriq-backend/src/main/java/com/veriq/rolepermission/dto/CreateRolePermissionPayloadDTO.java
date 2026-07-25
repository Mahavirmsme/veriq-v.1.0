package com.veriq.rolepermission.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateRolePermissionPayloadDTO {

    @NotNull(message = "roleId is required")
    private UUID roleId;

    @NotNull(message = "permissionId is required")
    private UUID permissionId;

    public CreateRolePermissionPayloadDTO() {}

    public UUID getRoleId() {
        return roleId;
    }

    public void setRoleId(UUID roleId) {
        this.roleId = roleId;
    }

    public UUID getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(UUID permissionId) {
        this.permissionId = permissionId;
    }
}
