package com.veriq.role.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.role.dto.CreateRolePayloadDTO;
import com.veriq.role.dto.RoleDTO;
import com.veriq.role.dto.UpdateRolePayloadDTO;
import com.veriq.role.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/roles")
@CrossOrigin(origins = "*")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleDTO>>> getAllRoles() {
        List<RoleDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.success(roles, "Roles retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleDTO>> getRoleById(@PathVariable UUID id) {
        RoleDTO role = roleService.getRoleById(id);
        return ResponseEntity.ok(ApiResponse.success(role, "Role retrieved successfully"));
    }

    @GetMapping("/code/{roleCode}")
    public ResponseEntity<ApiResponse<RoleDTO>> getRoleByCode(@PathVariable String roleCode) {
        RoleDTO role = roleService.getRoleByCode(roleCode);
        return ResponseEntity.ok(ApiResponse.success(role, "Role retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoleDTO>> createRole(@Valid @RequestBody CreateRolePayloadDTO payload) {
        RoleDTO role = roleService.createRole(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(role, "Role created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleDTO>> updateRole(@PathVariable UUID id, @Valid @RequestBody UpdateRolePayloadDTO payload) {
        RoleDTO role = roleService.updateRole(id, payload);
        return ResponseEntity.ok(ApiResponse.success(role, "Role updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable UUID id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Role deleted successfully"));
    }
}
