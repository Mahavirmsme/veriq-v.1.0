package com.veriq.telemetry.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.telemetry.dto.ValidationMetricsDTO;
import com.veriq.telemetry.validation.TelemetryValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class TelemetryValidationDiagnosticsController {

    private final TelemetryValidationService telemetryValidationService;

    public TelemetryValidationDiagnosticsController(TelemetryValidationService telemetryValidationService) {
        this.telemetryValidationService = telemetryValidationService;
    }

    @GetMapping("/validation-metrics")
    public ResponseEntity<ApiResponse<ValidationMetricsDTO>> getValidationMetrics() {
        ValidationMetricsDTO metrics = telemetryValidationService.getValidationMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Telemetry Validation Service diagnostics metrics retrieved"));
    }
}
