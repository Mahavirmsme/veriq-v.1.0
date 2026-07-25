package com.veriq.workspacerouting.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class WorkspaceRoutingRequestDTO {

    @NotNull(message = "userId is required")
    private UUID userId;

    public WorkspaceRoutingRequestDTO() {}

    public WorkspaceRoutingRequestDTO(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
