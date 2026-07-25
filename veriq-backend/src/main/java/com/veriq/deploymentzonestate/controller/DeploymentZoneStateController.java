package com.veriq.deploymentzonestate.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.deploymentzonestate.dto.DeploymentZoneStateDTO;
import com.veriq.deploymentzonestate.service.DeploymentZoneStateRepositoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/deployment-zone-states")
@CrossOrigin(origins = "*")
public class DeploymentZoneStateController {

    private final DeploymentZoneStateRepositoryService zoneStateRepositoryService;

    public DeploymentZoneStateController(DeploymentZoneStateRepositoryService zoneStateRepositoryService) {
        this.zoneStateRepositoryService = zoneStateRepositoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeploymentZoneStateDTO>>> getAllZoneStates() {
        List<DeploymentZoneStateDTO> states = zoneStateRepositoryService.getAllZoneStates();
        return ResponseEntity.ok(ApiResponse.success(states, "Latest Deployment Zone health states retrieved from Zone State Repository"));
    }

    @GetMapping("/zone/{deploymentZoneId}")
    public ResponseEntity<ApiResponse<DeploymentZoneStateDTO>> getLatestZoneState(@PathVariable UUID deploymentZoneId) {
        DeploymentZoneStateDTO state = zoneStateRepositoryService.getLatestZoneState(deploymentZoneId);
        return ResponseEntity.ok(ApiResponse.success(state, "Latest Deployment Zone state retrieved"));
    }
}
