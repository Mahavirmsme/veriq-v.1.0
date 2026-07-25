package com.veriq.bootstrap.controller;

import com.veriq.bootstrap.dto.BootstrapRequestDTO;
import com.veriq.bootstrap.dto.BootstrapStatusDTO;
import com.veriq.bootstrap.service.PlatformBootstrapService;
import com.veriq.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bootstrap")
@CrossOrigin(origins = "*")
public class PlatformBootstrapController {

    private final PlatformBootstrapService platformBootstrapService;

    public PlatformBootstrapController(PlatformBootstrapService platformBootstrapService) {
        this.platformBootstrapService = platformBootstrapService;
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<BootstrapStatusDTO>> getStatus() {
        BootstrapStatusDTO status = platformBootstrapService.getBootstrapStatus();
        return ResponseEntity.ok(ApiResponse.success(status, "Platform bootstrap status retrieved"));
    }

    @PostMapping("/initialize")
    public ResponseEntity<ApiResponse<BootstrapStatusDTO>> initialize(@Valid @RequestBody BootstrapRequestDTO request) {
        BootstrapStatusDTO status = platformBootstrapService.initializePlatform(request);
        return ResponseEntity.ok(ApiResponse.success(status, "VERIQ Platform initialized successfully"));
    }
}
