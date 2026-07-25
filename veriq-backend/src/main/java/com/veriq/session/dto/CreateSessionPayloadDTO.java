package com.veriq.session.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateSessionPayloadDTO {

    @NotNull(message = "userId is required")
    private UUID userId;

    private Long durationMinutes = 480L; // Default 8 hours session

    public CreateSessionPayloadDTO() {}

    public CreateSessionPayloadDTO(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Long getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Long durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}
