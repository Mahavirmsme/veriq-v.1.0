package com.veriq.userrole.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.userrole.dto.*;
import com.veriq.userrole.service.UserRoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
public class UserRoleController {

    private final UserRoleService userRoleService;

    public UserRoleController(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    // User-scoped role assignment & management endpoints
    @PostMapping("/api/v1/users/{userId}/roles")
    public ResponseEntity<ApiResponse<UserRolesResponseDTO>> assignRolesToUser(
            @PathVariable UUID userId,
            @RequestBody AssignRolesRequestDTO request) {
        UserRolesResponseDTO response = userRoleService.assignRolesToUser(userId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Roles assigned to user successfully"));
    }

    @PostMapping("/api/v1/users/{userId}/roles/{roleId}")
    public ResponseEntity<ApiResponse<UserRoleDTO>> assignSingleRoleToUser(
            @PathVariable UUID userId,
            @PathVariable UUID roleId) {
        UserRoleDTO dto = userRoleService.assignSingleRoleToUser(userId, roleId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Role assigned to user successfully"));
    }

    @DeleteMapping("/api/v1/users/{userId}/roles/{roleId}")
    public ResponseEntity<ApiResponse<Void>> removeRoleFromUser(
            @PathVariable UUID userId,
            @PathVariable UUID roleId) {
        userRoleService.removeRoleFromUser(userId, roleId);
        return ResponseEntity.ok(ApiResponse.success(null, "Role removed from user successfully"));
    }

    @PostMapping("/api/v1/users/{userId}/roles/remove")
    public ResponseEntity<ApiResponse<Void>> removeRolesFromUser(
            @PathVariable UUID userId,
            @RequestBody AssignRolesRequestDTO request) {
        userRoleService.removeRolesFromUser(userId, request.getRoleIds());
        return ResponseEntity.ok(ApiResponse.success(null, "Roles removed from user successfully"));
    }

    @GetMapping("/api/v1/users/{userId}/roles")
    public ResponseEntity<ApiResponse<UserRolesResponseDTO>> getRolesForUser(@PathVariable UUID userId) {
        UserRolesResponseDTO response = userRoleService.getRolesForUser(userId);
        return ResponseEntity.ok(ApiResponse.success(response, "User roles retrieved successfully"));
    }

    // Role-scoped user lookup endpoint
    @GetMapping("/api/v1/roles/{roleId}/users")
    public ResponseEntity<ApiResponse<RoleUsersResponseDTO>> getUsersForRole(@PathVariable UUID roleId) {
        RoleUsersResponseDTO response = userRoleService.getUsersForRole(roleId);
        return ResponseEntity.ok(ApiResponse.success(response, "Users assigned to role retrieved successfully"));
    }

    // Direct mapping endpoints
    @GetMapping("/api/v1/user-roles")
    public ResponseEntity<ApiResponse<List<UserRoleDTO>>> getAllUserRoles() {
        List<UserRoleDTO> list = userRoleService.getAllUserRoles();
        return ResponseEntity.ok(ApiResponse.success(list, "All user roles retrieved successfully"));
    }

    @GetMapping("/api/v1/user-roles/{id}")
    public ResponseEntity<ApiResponse<UserRoleDTO>> getUserRoleById(@PathVariable UUID id) {
        UserRoleDTO dto = userRoleService.getUserRoleById(id);
        return ResponseEntity.ok(ApiResponse.success(dto, "User role mapping retrieved successfully"));
    }

    @PostMapping("/api/v1/user-roles")
    public ResponseEntity<ApiResponse<UserRoleDTO>> createUserRole(@Valid @RequestBody CreateUserRolePayloadDTO payload) {
        UserRoleDTO dto = userRoleService.createUserRole(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "User role mapping created successfully"));
    }

    @PutMapping("/api/v1/user-roles/{id}")
    public ResponseEntity<ApiResponse<UserRoleDTO>> updateUserRole(
            @PathVariable UUID id,
            @Valid @RequestBody CreateUserRolePayloadDTO payload) {
        UserRoleDTO dto = userRoleService.updateUserRole(id, payload);
        return ResponseEntity.ok(ApiResponse.success(dto, "User role mapping updated successfully"));
    }

    @DeleteMapping("/api/v1/user-roles/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUserRole(@PathVariable UUID id) {
        userRoleService.deleteUserRole(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User role mapping deleted successfully"));
    }
}
