package com.veriq.rolepermission.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.rolepermission.dto.CreateRolePermissionPayloadDTO;
import com.veriq.rolepermission.dto.RolePermissionDTO;
import com.veriq.rolepermission.service.RolePermissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/role-permissions")
@CrossOrigin(origins = "*")
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    public RolePermissionController(RolePermissionService rolePermissionService) {
        this.rolePermissionService = rolePermissionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RolePermissionDTO>>> getAllRolePermissions() {
        List<RolePermissionDTO> list = rolePermissionService.getAllRolePermissions();
        return ResponseEntity.ok(ApiResponse.success(list, "Role permissions retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RolePermissionDTO>> getRolePermissionById(@PathVariable UUID id) {
        RolePermissionDTO dto = rolePermissionService.getRolePermissionById(id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Role permission retrieved successfully"));
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<ApiResponse<List<RolePermissionDTO>>> getRolePermissionsByRoleId(@PathVariable UUID roleId) {
        List<RolePermissionDTO> list = rolePermissionService.getRolePermissionsByRoleId(roleId);
        return ResponseEntity.ok(ApiResponse.success(list, "Role permissions for role retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RolePermissionDTO>> createRolePermission(@Valid @RequestBody CreateRolePermissionPayloadDTO payload) {
        RolePermissionDTO dto = rolePermissionService.createRolePermission(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Role permission created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RolePermissionDTO>> updateRolePermission(@PathVariable UUID id, @Valid @RequestBody CreateRolePermissionPayloadDTO payload) {
        RolePermissionDTO dto = rolePermissionService.updateRolePermission(id, payload);
        return ResponseEntity.ok(ApiResponse.success(dto, "Role permission updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRolePermission(@PathVariable UUID id) {
        rolePermissionService.deleteRolePermission(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Role permission deleted successfully"));
    }
}
