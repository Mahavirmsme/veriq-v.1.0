package com.veriq.authorization.dto;

import java.util.List;
import java.util.UUID;

public class EffectivePermissionDTO {

    private UUID userId;
    private String userEmail;
    private String userFullName;
    private UUID organizationId;
    private List<String> assignedRoleCodes;
    private List<String> effectivePermissions;
    private int totalEffectivePermissions;

    public EffectivePermissionDTO() {}

    public EffectivePermissionDTO(UUID userId, String userEmail, String userFullName, UUID organizationId,
                                  List<String> assignedRoleCodes, List<String> effectivePermissions) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.userFullName = userFullName;
        this.organizationId = organizationId;
        this.assignedRoleCodes = assignedRoleCodes;
        this.effectivePermissions = effectivePermissions;
        this.totalEffectivePermissions = effectivePermissions != null ? effectivePermissions.size() : 0;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(UUID organizationId) {
        this.organizationId = organizationId;
    }

    public List<String> getAssignedRoleCodes() {
        return assignedRoleCodes;
    }

    public void setAssignedRoleCodes(List<String> assignedRoleCodes) {
        this.assignedRoleCodes = assignedRoleCodes;
    }

    public List<String> getEffectivePermissions() {
        return effectivePermissions;
    }

    public void setEffectivePermissions(List<String> effectivePermissions) {
        this.effectivePermissions = effectivePermissions;
        this.totalEffectivePermissions = effectivePermissions != null ? effectivePermissions.size() : 0;
    }

    public int getTotalEffectivePermissions() {
        return totalEffectivePermissions;
    }

    public void setTotalEffectivePermissions(int totalEffectivePermissions) {
        this.totalEffectivePermissions = totalEffectivePermissions;
    }
}
