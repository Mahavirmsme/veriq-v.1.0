package com.veriq.engineeringengine.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.engineeringengine.dto.EngineeringEngineMetricsDTO;
import com.veriq.engineeringengine.service.EngineeringEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class EngineeringEngineDiagnosticsController {

    private final EngineeringEngineService engineeringEngineService;

    public EngineeringEngineDiagnosticsController(EngineeringEngineService engineeringEngineService) {
        this.engineeringEngineService = engineeringEngineService;
    }

    @GetMapping("/engineering-engine-metrics")
    public ResponseEntity<ApiResponse<EngineeringEngineMetricsDTO>> getMetrics() {
        EngineeringEngineMetricsDTO metrics = engineeringEngineService.getDiagnosticsMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Engineering Engine background diagnostics metrics retrieved"));
    }
}
