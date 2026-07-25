package com.veriq.auth.dto;

import java.util.UUID;

public class LoginResponseDTO {

    private UUID userId;
    private String email;
    private String displayName;
    private boolean authenticated;
    private String message;

    public LoginResponseDTO() {}

    public LoginResponseDTO(UUID userId, String email, String displayName, boolean authenticated, String message) {
        this.userId = userId;
        this.email = email;
        this.displayName = displayName;
        this.authenticated = authenticated;
        this.message = message;
    }

    public static LoginResponseDTO success(UUID userId, String email, String displayName) {
        return new LoginResponseDTO(userId, email, displayName, true, "Authentication Success");
    }

    public static LoginResponseDTO failure(String message) {
        return new LoginResponseDTO(null, null, null, false, message != null ? message : "Authentication Failed");
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

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
