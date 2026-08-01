package com.veriq.authorization.controller;

import com.veriq.authorization.dto.EffectivePermissionDTO;
import com.veriq.authorization.service.EffectivePermissionService;
import com.veriq.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
public class EffectivePermissionController {

    private final EffectivePermissionService effectivePermissionService;

    public EffectivePermissionController(EffectivePermissionService effectivePermissionService) {
        this.effectivePermissionService = effectivePermissionService;
    }

    @GetMapping("/api/v1/users/{userId}/effective-permissions")
    public ResponseEntity<ApiResponse<EffectivePermissionDTO>> getEffectivePermissionsForUser(@PathVariable UUID userId) {
        EffectivePermissionDTO dto = effectivePermissionService.getEffectivePermissionsForUser(userId);
        return ResponseEntity.ok(ApiResponse.success(dto, "User effective permissions resolved successfully"));
    }

    @GetMapping("/api/v1/users/me/effective-permissions")
    public ResponseEntity<ApiResponse<EffectivePermissionDTO>> getEffectivePermissionsForCurrentUser() {
        EffectivePermissionDTO dto = effectivePermissionService.getEffectivePermissionsForCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(dto, "Current user effective permissions resolved successfully"));
    }
}
