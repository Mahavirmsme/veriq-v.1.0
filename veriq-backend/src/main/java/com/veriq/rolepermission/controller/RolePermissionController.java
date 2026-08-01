package com.veriq.rolepermission.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.rolepermission.dto.*;
import com.veriq.rolepermission.service.RolePermissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    public RolePermissionController(RolePermissionService rolePermissionService) {
        this.rolePermissionService = rolePermissionService;
    }

    // Role-scoped permission assignment & management endpoints
    @PostMapping("/api/v1/roles/{roleId}/permissions")
    public ResponseEntity<ApiResponse<RolePermissionsResponseDTO>> assignPermissionsToRole(
            @PathVariable UUID roleId,
            @RequestBody AssignPermissionsRequestDTO request) {
        RolePermissionsResponseDTO response = rolePermissionService.assignPermissionsToRole(roleId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Permissions assigned to role successfully"));
    }

    @PostMapping("/api/v1/roles/{roleId}/permissions/{permissionId}")
    public ResponseEntity<ApiResponse<RolePermissionDTO>> assignSinglePermissionToRole(
            @PathVariable UUID roleId,
            @PathVariable UUID permissionId) {
        RolePermissionDTO dto = rolePermissionService.assignSinglePermissionToRole(roleId, permissionId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Permission assigned to role successfully"));
    }

    @DeleteMapping("/api/v1/roles/{roleId}/permissions/{permissionId}")
    public ResponseEntity<ApiResponse<Void>> removePermissionFromRole(
            @PathVariable UUID roleId,
            @PathVariable UUID permissionId) {
        rolePermissionService.removePermissionFromRole(roleId, permissionId);
        return ResponseEntity.ok(ApiResponse.success(null, "Permission removed from role successfully"));
    }

    @PostMapping("/api/v1/roles/{roleId}/permissions/remove")
    public ResponseEntity<ApiResponse<Void>> removePermissionsFromRole(
            @PathVariable UUID roleId,
            @RequestBody AssignPermissionsRequestDTO request) {
        rolePermissionService.removePermissionsFromRole(roleId, request.getPermissionIds());
        return ResponseEntity.ok(ApiResponse.success(null, "Permissions removed from role successfully"));
    }

    @GetMapping("/api/v1/roles/{roleId}/permissions")
    public ResponseEntity<ApiResponse<RolePermissionsResponseDTO>> getPermissionsForRole(@PathVariable UUID roleId) {
        RolePermissionsResponseDTO response = rolePermissionService.getPermissionsForRole(roleId);
        return ResponseEntity.ok(ApiResponse.success(response, "Role permissions retrieved successfully"));
    }

    // Permission-scoped role lookup endpoint
    @GetMapping("/api/v1/permissions/{permissionId}/roles")
    public ResponseEntity<ApiResponse<PermissionRolesResponseDTO>> getRolesForPermission(@PathVariable UUID permissionId) {
        PermissionRolesResponseDTO response = rolePermissionService.getRolesForPermission(permissionId);
        return ResponseEntity.ok(ApiResponse.success(response, "Roles containing permission retrieved successfully"));
    }

    // Direct mapping endpoints
    @GetMapping("/api/v1/role-permissions")
    public ResponseEntity<ApiResponse<List<RolePermissionDTO>>> getAllRolePermissions() {
        List<RolePermissionDTO> list = rolePermissionService.getAllRolePermissions();
        return ResponseEntity.ok(ApiResponse.success(list, "All role permissions retrieved successfully"));
    }

    @GetMapping("/api/v1/role-permissions/{id}")
    public ResponseEntity<ApiResponse<RolePermissionDTO>> getRolePermissionById(@PathVariable UUID id) {
        RolePermissionDTO dto = rolePermissionService.getRolePermissionById(id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Role permission mapping retrieved successfully"));
    }

    @PostMapping("/api/v1/role-permissions")
    public ResponseEntity<ApiResponse<RolePermissionDTO>> createRolePermission(@Valid @RequestBody CreateRolePermissionPayloadDTO payload) {
        RolePermissionDTO dto = rolePermissionService.createRolePermission(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Role permission mapping created successfully"));
    }

    @DeleteMapping("/api/v1/role-permissions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRolePermission(@PathVariable UUID id) {
        rolePermissionService.deleteRolePermission(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Role permission mapping deleted successfully"));
    }
}
