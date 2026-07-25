package com.veriq.role.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateRolePayloadDTO {

    @NotBlank(message = "Role code is required")
    private String roleCode;

    @NotBlank(message = "Role name is required")
    private String roleName;

    private String roleDescription;

    public CreateRolePayloadDTO() {}

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

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }
}
