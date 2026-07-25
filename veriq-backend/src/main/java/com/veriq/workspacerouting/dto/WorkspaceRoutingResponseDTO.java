package com.veriq.workspacerouting.dto;

import java.util.List;
import java.util.UUID;

public class WorkspaceRoutingResponseDTO {

    private UUID userId;
    private List<String> availableWorkspaces;
    private String defaultWorkspace;
    private boolean selectionRequired;

    public WorkspaceRoutingResponseDTO() {}

    public WorkspaceRoutingResponseDTO(UUID userId, List<String> availableWorkspaces, String defaultWorkspace, boolean selectionRequired) {
        this.userId = userId;
        this.availableWorkspaces = availableWorkspaces;
        this.defaultWorkspace = defaultWorkspace;
        this.selectionRequired = selectionRequired;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public List<String> getAvailableWorkspaces() {
        return availableWorkspaces;
    }

    public void setAvailableWorkspaces(List<String> availableWorkspaces) {
        this.availableWorkspaces = availableWorkspaces;
    }

    public String getDefaultWorkspace() {
        return defaultWorkspace;
    }

    public void setDefaultWorkspace(String defaultWorkspace) {
        this.defaultWorkspace = defaultWorkspace;
    }

    public boolean isSelectionRequired() {
        return selectionRequired;
    }

    public void setSelectionRequired(boolean selectionRequired) {
        this.selectionRequired = selectionRequired;
    }
}
