package com.veriq.telemetry.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.telemetry.dto.TelemetryMetricsDTO;
import com.veriq.telemetry.service.TelemetryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class TelemetryDiagnosticsController {

    private final TelemetryService telemetryService;

    public TelemetryDiagnosticsController(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    @GetMapping("/telemetry-metrics")
    public ResponseEntity<ApiResponse<TelemetryMetricsDTO>> getTelemetryMetrics() {
        TelemetryMetricsDTO metrics = telemetryService.getDiagnosticsMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Telemetry transport service diagnostics metrics retrieved"));
    }
}
