package com.veriq.auth.dto;

import java.util.List;
import java.util.UUID;

public class UserSessionDTO {

    private UUID userId;
    private String username;
    private String name;
    private String email;
    private List<String> roles;
    private List<String> allowedWorkspaces;

    public UserSessionDTO() {}

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public List<String> getAllowedWorkspaces() {
        return allowedWorkspaces;
    }

    public void setAllowedWorkspaces(List<String> allowedWorkspaces) {
        this.allowedWorkspaces = allowedWorkspaces;
    }
}
