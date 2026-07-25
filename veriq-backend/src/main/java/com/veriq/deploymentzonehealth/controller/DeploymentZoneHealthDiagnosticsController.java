package com.veriq.deploymentzonehealth.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.deploymentzonehealth.dto.DeploymentZoneHealthMetricsDTO;
import com.veriq.deploymentzonehealth.service.DeploymentZoneHealthEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class DeploymentZoneHealthDiagnosticsController {

    private final DeploymentZoneHealthEngineService deploymentZoneHealthEngineService;

    public DeploymentZoneHealthDiagnosticsController(DeploymentZoneHealthEngineService deploymentZoneHealthEngineService) {
        this.deploymentZoneHealthEngineService = deploymentZoneHealthEngineService;
    }

    @GetMapping("/deployment-zone-health-metrics")
    public ResponseEntity<ApiResponse<DeploymentZoneHealthMetricsDTO>> getMetrics() {
        DeploymentZoneHealthMetricsDTO metrics = deploymentZoneHealthEngineService.getDiagnosticsMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Deployment Zone Health Engine background diagnostics metrics retrieved"));
    }
}
