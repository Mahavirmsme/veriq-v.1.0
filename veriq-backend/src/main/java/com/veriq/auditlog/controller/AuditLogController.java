package com.veriq.auditlog.controller;

import com.veriq.auditlog.dto.AuditLogDTO;
import com.veriq.auditlog.service.AuditLogService;
import com.veriq.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAllAuditLogs() {
        List<AuditLogDTO> list = auditLogService.getAllAuditLogs();
        return ResponseEntity.ok(ApiResponse.success(list, "Audit logs retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuditLogDTO>> getAuditLogById(@PathVariable UUID id) {
        AuditLogDTO dto = auditLogService.getAuditLogById(id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Audit log record retrieved successfully"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogsByUserId(@PathVariable UUID userId) {
        List<AuditLogDTO> list = auditLogService.getAuditLogsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(list, "Audit logs for user retrieved successfully"));
    }

    @GetMapping("/resource/{resourceType}/{resourceId}")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogsByResource(
            @PathVariable String resourceType,
            @PathVariable String resourceId) {
        List<AuditLogDTO> list = auditLogService.getAuditLogsByResource(resourceType, resourceId);
        return ResponseEntity.ok(ApiResponse.success(list, "Audit logs for resource retrieved successfully"));
    }
}
