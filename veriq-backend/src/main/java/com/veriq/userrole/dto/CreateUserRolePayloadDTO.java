package com.veriq.userrole.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateUserRolePayloadDTO {

    @NotNull(message = "userId is required")
    private UUID userId;

    @NotNull(message = "roleId is required")
    private UUID roleId;

    public CreateUserRolePayloadDTO() {}

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getRoleId() {
        return roleId;
    }

    public void setRoleId(UUID roleId) {
        this.roleId = roleId;
    }
}
