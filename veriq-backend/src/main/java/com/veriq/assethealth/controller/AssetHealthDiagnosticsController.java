package com.veriq.assethealth.controller;

import com.veriq.assethealth.dto.AssetHealthMetricsDTO;
import com.veriq.assethealth.service.AssetHealthEngineService;
import com.veriq.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class AssetHealthDiagnosticsController {

    private final AssetHealthEngineService assetHealthEngineService;

    public AssetHealthDiagnosticsController(AssetHealthEngineService assetHealthEngineService) {
        this.assetHealthEngineService = assetHealthEngineService;
    }

    @GetMapping("/asset-health-metrics")
    public ResponseEntity<ApiResponse<AssetHealthMetricsDTO>> getMetrics() {
        AssetHealthMetricsDTO metrics = assetHealthEngineService.getDiagnosticsMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Asset Health Engine background diagnostics metrics retrieved"));
    }
}
