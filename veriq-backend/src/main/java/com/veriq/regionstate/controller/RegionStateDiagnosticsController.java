package com.veriq.regionstate.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.regionstate.dto.RegionStateMetricsDTO;
import com.veriq.regionstate.service.RegionStateRepositoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class RegionStateDiagnosticsController {

    private final RegionStateRepositoryService regionStateRepositoryService;

    public RegionStateDiagnosticsController(RegionStateRepositoryService regionStateRepositoryService) {
        this.regionStateRepositoryService = regionStateRepositoryService;
    }

    @GetMapping("/region-state-metrics")
    public ResponseEntity<ApiResponse<RegionStateMetricsDTO>> getMetrics() {
        RegionStateMetricsDTO metrics = regionStateRepositoryService.getDiagnosticsMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Region State Repository developer diagnostics metrics retrieved"));
    }
}
