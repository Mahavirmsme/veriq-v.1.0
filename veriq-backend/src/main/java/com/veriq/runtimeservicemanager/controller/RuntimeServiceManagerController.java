package com.veriq.runtimeservicemanager.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.runtimeservicemanager.dto.RuntimeServiceManagerStatusDTO;
import com.veriq.runtimeservicemanager.dto.TelemetryPacket;
import com.veriq.runtimeservicemanager.service.RuntimeServiceManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/runtime-service-manager")
@CrossOrigin(origins = "*")
public class RuntimeServiceManagerController {

    private final RuntimeServiceManager runtimeServiceManager;

    public RuntimeServiceManagerController(RuntimeServiceManager runtimeServiceManager) {
        this.runtimeServiceManager = runtimeServiceManager;
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<RuntimeServiceManagerStatusDTO>> getStatus() {
        RuntimeServiceManagerStatusDTO status = runtimeServiceManager.getStatus();
        return ResponseEntity.ok(ApiResponse.success(status, "Runtime Service Manager heartbeat status retrieved"));
    }

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<RuntimeServiceManagerStatusDTO>> startService() {
        runtimeServiceManager.startService();
        return ResponseEntity.ok(ApiResponse.success(runtimeServiceManager.getStatus(), "Runtime Service Manager started successfully"));
    }

    @PostMapping("/pause")
    public ResponseEntity<ApiResponse<RuntimeServiceManagerStatusDTO>> pauseService() {
        runtimeServiceManager.pauseService();
        return ResponseEntity.ok(ApiResponse.success(runtimeServiceManager.getStatus(), "Runtime Service Manager paused successfully"));
    }

    @PostMapping("/trigger-cycle")
    public ResponseEntity<ApiResponse<List<TelemetryPacket>>> triggerCycle() {
        List<TelemetryPacket> packets = runtimeServiceManager.triggerManualCycle();
        return ResponseEntity.ok(ApiResponse.success(packets, "Manual runtime cycle executed, produced " + packets.size() + " telemetry packets"));
    }
}
