package com.veriq.session.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.OffsetDateTime;
import java.util.UUID;

public class UserSessionDTO {

    private UUID id;
    private UUID userId;
    private String sessionToken;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime loginTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime lastActivityTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime expiryTime;

    private String sessionStatus;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    public UserSessionDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }

    public OffsetDateTime getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(OffsetDateTime loginTime) {
        this.loginTime = loginTime;
    }

    public OffsetDateTime getLastActivityTime() {
        return lastActivityTime;
    }

    public void setLastActivityTime(OffsetDateTime lastActivityTime) {
        this.lastActivityTime = lastActivityTime;
    }

    public OffsetDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(OffsetDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public String getSessionStatus() {
        return sessionStatus;
    }

    public void setSessionStatus(String sessionStatus) {
        this.sessionStatus = sessionStatus;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
