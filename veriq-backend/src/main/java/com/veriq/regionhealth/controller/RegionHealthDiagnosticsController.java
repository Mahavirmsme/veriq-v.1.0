package com.veriq.regionhealth.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.regionhealth.dto.RegionHealthMetricsDTO;
import com.veriq.regionhealth.service.RegionHealthEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class RegionHealthDiagnosticsController {

    private final RegionHealthEngineService regionHealthEngineService;

    public RegionHealthDiagnosticsController(RegionHealthEngineService regionHealthEngineService) {
        this.regionHealthEngineService = regionHealthEngineService;
    }

    @GetMapping("/region-health-metrics")
    public ResponseEntity<ApiResponse<RegionHealthMetricsDTO>> getMetrics() {
        RegionHealthMetricsDTO metrics = regionHealthEngineService.getDiagnosticsMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Region Health Engine background diagnostics metrics retrieved"));
    }
}
