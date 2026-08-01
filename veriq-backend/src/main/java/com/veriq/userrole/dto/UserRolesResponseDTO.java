package com.veriq.userrole.dto;

import com.veriq.role.dto.RoleDTO;
import java.util.List;
import java.util.UUID;

public class UserRolesResponseDTO {

    private UUID userId;
    private String email;
    private String fullName;
    private UUID organizationId;
    private List<RoleDTO> roles;

    public UserRolesResponseDTO() {}

    public UserRolesResponseDTO(UUID userId, String email, String fullName, UUID organizationId, List<RoleDTO> roles) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.organizationId = organizationId;
        this.roles = roles;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(UUID organizationId) {
        this.organizationId = organizationId;
    }

    public List<RoleDTO> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }
}
