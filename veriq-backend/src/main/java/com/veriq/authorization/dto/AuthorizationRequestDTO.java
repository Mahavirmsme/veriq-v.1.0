package com.veriq.authorization.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class AuthorizationRequestDTO {

    @NotNull(message = "userId is required")
    private UUID userId;

    public AuthorizationRequestDTO() {}

    public AuthorizationRequestDTO(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
