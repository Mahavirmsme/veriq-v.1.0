package com.veriq.workspacerouting.service;

import com.veriq.workspacerouting.dto.WorkspaceRoutingRequestDTO;
import com.veriq.workspacerouting.dto.WorkspaceRoutingResponseDTO;

public interface WorkspaceRoutingService {
    WorkspaceRoutingResponseDTO resolveWorkspace(WorkspaceRoutingRequestDTO request);
}
