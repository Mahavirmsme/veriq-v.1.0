package com.veriq.authorization.dto;

import java.util.List;
import java.util.UUID;

public class AuthorizationResponseDTO {

    private UUID userId;
    private List<String> assignedRoles;
    private List<String> grantedPermissions;

    public AuthorizationResponseDTO() {}

    public AuthorizationResponseDTO(UUID userId, List<String> assignedRoles, List<String> grantedPermissions) {
        this.userId = userId;
        this.assignedRoles = assignedRoles;
        this.grantedPermissions = grantedPermissions;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public List<String> getAssignedRoles() {
        return assignedRoles;
    }

    public void setAssignedRoles(List<String> assignedRoles) {
        this.assignedRoles = assignedRoles;
    }

    public List<String> getGrantedPermissions() {
        return grantedPermissions;
    }

    public void setGrantedPermissions(List<String> grantedPermissions) {
        this.grantedPermissions = grantedPermissions;
    }
}
