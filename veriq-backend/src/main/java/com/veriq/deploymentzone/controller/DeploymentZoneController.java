package com.veriq.deploymentzone.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.deploymentzone.dto.DeploymentZoneResponseDTO;
import com.veriq.deploymentzone.dto.SaveDeploymentZonesRequestDTO;
import com.veriq.deploymentzone.service.DeploymentZoneService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/deployment-zones")
@CrossOrigin(origins = "*")
public class DeploymentZoneController {

    private final DeploymentZoneService deploymentZoneService;

    public DeploymentZoneController(DeploymentZoneService deploymentZoneService) {
        this.deploymentZoneService = deploymentZoneService;
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<ApiResponse<List<DeploymentZoneResponseDTO>>> getZonesByRegionId(@PathVariable UUID regionId) {
        List<DeploymentZoneResponseDTO> zones = deploymentZoneService.getZonesByRegionId(regionId);
        return ResponseEntity.ok(ApiResponse.success(zones, "Deployment zone engineering design retrieved successfully"));
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<List<DeploymentZoneResponseDTO>>> saveDeploymentZones(
            @Valid @RequestBody SaveDeploymentZonesRequestDTO requestDTO) {
        List<DeploymentZoneResponseDTO> savedZones = deploymentZoneService.saveDeploymentZones(requestDTO);
        return ResponseEntity.ok(ApiResponse.success(savedZones, "Deployment zone engineering design validated and saved successfully"));
    }
}
