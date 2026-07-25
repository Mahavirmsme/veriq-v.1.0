package com.veriq.workspacerouting.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.workspacerouting.dto.WorkspaceRoutingRequestDTO;
import com.veriq.workspacerouting.dto.WorkspaceRoutingResponseDTO;
import com.veriq.workspacerouting.service.WorkspaceRoutingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/workspace-routing")
@CrossOrigin(origins = "*")
public class WorkspaceRoutingController {

    private final WorkspaceRoutingService workspaceRoutingService;

    public WorkspaceRoutingController(WorkspaceRoutingService workspaceRoutingService) {
        this.workspaceRoutingService = workspaceRoutingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkspaceRoutingResponseDTO>> resolveWorkspace(@Valid @RequestBody WorkspaceRoutingRequestDTO request) {
        WorkspaceRoutingResponseDTO response = workspaceRoutingService.resolveWorkspace(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Workspace routing resolved successfully"));
    }
}
