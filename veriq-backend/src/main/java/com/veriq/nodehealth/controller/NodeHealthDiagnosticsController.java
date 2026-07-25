package com.veriq.nodehealth.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.nodehealth.dto.NodeHealthMetricsDTO;
import com.veriq.nodehealth.service.NodeHealthEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class NodeHealthDiagnosticsController {

    private final NodeHealthEngineService nodeHealthEngineService;

    public NodeHealthDiagnosticsController(NodeHealthEngineService nodeHealthEngineService) {
        this.nodeHealthEngineService = nodeHealthEngineService;
    }

    @GetMapping("/node-health-metrics")
    public ResponseEntity<ApiResponse<NodeHealthMetricsDTO>> getMetrics() {
        NodeHealthMetricsDTO metrics = nodeHealthEngineService.getDiagnosticsMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Node Health Engine background diagnostics metrics retrieved"));
    }
}
