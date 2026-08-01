package com.veriq.userrole.dto;

import java.util.List;
import java.util.UUID;

public class AssignRolesRequestDTO {

    private List<UUID> roleIds;
    private List<String> roleCodes;

    public AssignRolesRequestDTO() {}

    public AssignRolesRequestDTO(List<UUID> roleIds) {
        this.roleIds = roleIds;
    }

    public List<UUID> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(List<UUID> roleIds) {
        this.roleIds = roleIds;
    }

    public List<String> getRoleCodes() {
        return roleCodes;
    }

    public void setRoleCodes(List<String> roleCodes) {
        this.roleCodes = roleCodes;
    }
}
