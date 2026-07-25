package com.veriq.userrole.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.userrole.dto.CreateUserRolePayloadDTO;
import com.veriq.userrole.dto.UserRoleDTO;
import com.veriq.userrole.service.UserRoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user-roles")
@CrossOrigin(origins = "*")
public class UserRoleController {

    private final UserRoleService userRoleService;

    public UserRoleController(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserRoleDTO>>> getAllUserRoles() {
        List<UserRoleDTO> list = userRoleService.getAllUserRoles();
        return ResponseEntity.ok(ApiResponse.success(list, "User roles retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserRoleDTO>> getUserRoleById(@PathVariable UUID id) {
        UserRoleDTO dto = userRoleService.getUserRoleById(id);
        return ResponseEntity.ok(ApiResponse.success(dto, "User role retrieved successfully"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<UserRoleDTO>>> getUserRolesByUserId(@PathVariable UUID userId) {
        List<UserRoleDTO> list = userRoleService.getUserRolesByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(list, "User roles for user retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserRoleDTO>> createUserRole(@Valid @RequestBody CreateUserRolePayloadDTO payload) {
        UserRoleDTO dto = userRoleService.createUserRole(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "User role mapping created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserRoleDTO>> updateUserRole(@PathVariable UUID id, @Valid @RequestBody CreateUserRolePayloadDTO payload) {
        UserRoleDTO dto = userRoleService.updateUserRole(id, payload);
        return ResponseEntity.ok(ApiResponse.success(dto, "User role mapping updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUserRole(@PathVariable UUID id) {
        userRoleService.deleteUserRole(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User role mapping deleted successfully"));
    }
}
