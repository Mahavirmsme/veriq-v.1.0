package com.veriq.role.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateRolePayloadDTO {

    @NotBlank(message = "Role name is required")
    private String roleName;

    private String roleDescription;

    private String status;

    public UpdateRolePayloadDTO() {}

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
