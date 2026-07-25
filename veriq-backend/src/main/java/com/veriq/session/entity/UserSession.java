package com.veriq.session.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_sessions")
public class UserSession {

    @Id
    @Column(name = "session_id")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "session_token", nullable = false, unique = true)
    private String sessionToken;

    @Column(name = "login_time", insertable = false, updatable = false)
    private OffsetDateTime loginTime;

    @Column(name = "last_activity_time")
    private OffsetDateTime lastActivityTime;

    @Column(name = "expiry_time", nullable = false)
    private OffsetDateTime expiryTime;

    @Column(name = "session_status", nullable = false)
    private String sessionStatus = "ACTIVE";

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public UserSession() {
        this.id = UUID.randomUUID();
        this.lastActivityTime = OffsetDateTime.now();
    }

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
}
