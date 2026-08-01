package com.veriq.auditlog.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CreateAuditLogPayloadDTO {

    private UUID userId;
    private UUID organizationId;

    @NotBlank(message = "Action is required")
    private String action;

    @NotBlank(message = "Resource type is required")
    private String resourceType;

    private String resourceId;

    @NotBlank(message = "Result is required")
    private String result;

    private String ipAddress;
    private String userAgent;
    private String details;

    public CreateAuditLogPayloadDTO() {}

    public CreateAuditLogPayloadDTO(UUID userId, UUID organizationId, String action, String resourceType, String resourceId, String result, String details) {
        this.userId = userId;
        this.organizationId = organizationId;
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.result = result;
        this.details = details;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(UUID organizationId) {
        this.organizationId = organizationId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
