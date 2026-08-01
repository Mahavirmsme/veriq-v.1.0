package com.veriq.userrole.dto;

import com.veriq.user.dto.UserDTO;
import java.util.List;
import java.util.UUID;

public class RoleUsersResponseDTO {

    private UUID roleId;
    private String roleCode;
    private String roleName;
    private boolean isSystemRole;
    private UUID organizationId;
    private List<UserDTO> users;

    public RoleUsersResponseDTO() {}

    public RoleUsersResponseDTO(UUID roleId, String roleCode, String roleName, boolean isSystemRole, UUID organizationId, List<UserDTO> users) {
        this.roleId = roleId;
        this.roleCode = roleCode;
        this.roleName = roleName;
        this.isSystemRole = isSystemRole;
        this.organizationId = organizationId;
        this.users = users;
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

    public List<UserDTO> getUsers() {
        return users;
    }

    public void setUsers(List<UserDTO> users) {
        this.users = users;
    }
}
