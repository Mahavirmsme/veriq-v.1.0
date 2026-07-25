package com.veriq.permission.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.permission.dto.CreatePermissionPayloadDTO;
import com.veriq.permission.dto.PermissionDTO;
import com.veriq.permission.dto.UpdatePermissionPayloadDTO;
import com.veriq.permission.service.PermissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/permissions")
@CrossOrigin(origins = "*")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PermissionDTO>>> getAllPermissions() {
        List<PermissionDTO> permissions = permissionService.getAllPermissions();
        return ResponseEntity.ok(ApiResponse.success(permissions, "Permissions retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PermissionDTO>> getPermissionById(@PathVariable UUID id) {
        PermissionDTO permission = permissionService.getPermissionById(id);
        return ResponseEntity.ok(ApiResponse.success(permission, "Permission retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PermissionDTO>> createPermission(@Valid @RequestBody CreatePermissionPayloadDTO payload) {
        PermissionDTO permission = permissionService.createPermission(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(permission, "Permission created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PermissionDTO>> updatePermission(@PathVariable UUID id, @Valid @RequestBody UpdatePermissionPayloadDTO payload) {
        PermissionDTO permission = permissionService.updatePermission(id, payload);
        return ResponseEntity.ok(ApiResponse.success(permission, "Permission updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePermission(@PathVariable UUID id) {
        permissionService.deletePermission(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Permission deleted successfully"));
    }
}
