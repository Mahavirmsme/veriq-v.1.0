package com.veriq.permission.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.permission.dto.PermissionDTO;
import com.veriq.permission.service.PermissionService;
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

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<PermissionDTO>> getPermissionByCode(@PathVariable String code) {
        PermissionDTO permission = permissionService.getPermissionByCode(code);
        return ResponseEntity.ok(ApiResponse.success(permission, "Permission retrieved successfully"));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<PermissionDTO>>> getPermissionsByCategory(@PathVariable String category) {
        List<PermissionDTO> permissions = permissionService.getPermissionsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(permissions, "Category permissions retrieved successfully"));
    }
}
