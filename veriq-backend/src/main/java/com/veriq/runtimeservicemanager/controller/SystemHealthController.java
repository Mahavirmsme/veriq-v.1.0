package com.veriq.runtimeservicemanager.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.runtimeservicemanager.dto.RuntimeServiceManagerStatusDTO;
import com.veriq.runtimeservicemanager.service.RuntimeServiceManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class SystemHealthController {

    private final RuntimeServiceManager runtimeServiceManager;

    public SystemHealthController(RuntimeServiceManager runtimeServiceManager) {
        this.runtimeServiceManager = runtimeServiceManager;
    }

    @GetMapping("/runtime-health")
    public ResponseEntity<ApiResponse<RuntimeServiceManagerStatusDTO>> getSystemRuntimeHealth() {
        RuntimeServiceManagerStatusDTO status = runtimeServiceManager.getStatus();
        return ResponseEntity.ok(ApiResponse.success(status, "System Runtime Service background status retrieved for System Administration"));
    }
}
