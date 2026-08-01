package com.veriq.authorization.controller;

import com.veriq.authorization.annotation.RequirePermission;
import com.veriq.authorization.context.UserContextHolder;
import com.veriq.authorization.service.PermissionEvaluationService;
import com.veriq.common.context.TenantContextResolver;
import com.veriq.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/authorization")
@CrossOrigin(origins = "*")
public class AuthorizationGuardTestController {

    private final PermissionEvaluationService permissionEvaluationService;
    private final TenantContextResolver tenantContextResolver;

    public AuthorizationGuardTestController(PermissionEvaluationService permissionEvaluationService,
                                            TenantContextResolver tenantContextResolver) {
        this.permissionEvaluationService = permissionEvaluationService;
        this.tenantContextResolver = tenantContextResolver;
    }

    @GetMapping("/effective-permissions")
    public ResponseEntity<ApiResponse<Set<String>>> getEffectivePermissions() {
        UUID userId = UserContextHolder.getCurrentUserId().orElse(null);
        UUID organizationId = tenantContextResolver.resolveCurrentOrganizationId().orElse(null);
        Set<String> permissions = permissionEvaluationService.getEffectivePermissions(userId, organizationId);
        return ResponseEntity.ok(ApiResponse.success(permissions, "Effective permissions calculated successfully"));
    }

    @GetMapping("/test/user-read")
    @RequirePermission("user.read")
    public ResponseEntity<ApiResponse<Map<String, String>>> testUserReadAccess() {
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("status", "GRANTED", "permissionRequired", "user.read"),
                "Access granted to user.read protected endpoint"
        ));
    }

    @GetMapping("/test/audit-read")
    @RequirePermission("audit.read")
    public ResponseEntity<ApiResponse<Map<String, String>>> testAuditReadAccess() {
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("status", "GRANTED", "permissionRequired", "audit.read"),
                "Access granted to audit.read protected endpoint"
        ));
    }

    @GetMapping("/test/admin-manage")
    @RequirePermission("admin.organization.manage")
    public ResponseEntity<ApiResponse<Map<String, String>>> testAdminManageAccess() {
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("status", "GRANTED", "permissionRequired", "admin.organization.manage"),
                "Access granted to admin.organization.manage protected endpoint"
        ));
    }
}
