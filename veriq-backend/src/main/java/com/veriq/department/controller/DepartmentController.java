package com.veriq.department.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.department.dto.CreateDepartmentPayloadDTO;
import com.veriq.department.dto.DepartmentDTO;
import com.veriq.department.dto.UpdateDepartmentPayloadDTO;
import com.veriq.department.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments() {
        List<DepartmentDTO> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success(departments, "Departments retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartmentById(@PathVariable UUID id) {
        DepartmentDTO department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.success(department, "Department retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(@Valid @RequestBody CreateDepartmentPayloadDTO payload) {
        DepartmentDTO department = departmentService.createDepartment(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(department, "Department created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(@PathVariable UUID id, @Valid @RequestBody UpdateDepartmentPayloadDTO payload) {
        DepartmentDTO department = departmentService.updateDepartment(id, payload);
        return ResponseEntity.ok(ApiResponse.success(department, "Department updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable UUID id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Department deleted successfully"));
    }
}
