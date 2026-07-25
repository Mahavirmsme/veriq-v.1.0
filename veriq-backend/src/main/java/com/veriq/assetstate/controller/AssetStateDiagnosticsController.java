package com.veriq.assetstate.controller;

import com.veriq.assetstate.dto.AssetStateMetricsDTO;
import com.veriq.assetstate.service.AssetStateRepositoryService;
import com.veriq.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class AssetStateDiagnosticsController {

    private final AssetStateRepositoryService assetStateRepositoryService;

    public AssetStateDiagnosticsController(AssetStateRepositoryService assetStateRepositoryService) {
        this.assetStateRepositoryService = assetStateRepositoryService;
    }

    @GetMapping("/asset-state-metrics")
    public ResponseEntity<ApiResponse<AssetStateMetricsDTO>> getMetrics() {
        AssetStateMetricsDTO metrics = assetStateRepositoryService.getDiagnosticsMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Asset State Repository developer diagnostics metrics retrieved"));
    }
}
