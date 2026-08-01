package com.veriq.designation.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.designation.dto.CreateDesignationPayloadDTO;
import com.veriq.designation.dto.DesignationDTO;
import com.veriq.designation.dto.UpdateDesignationPayloadDTO;
import com.veriq.designation.service.DesignationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/designations")
@CrossOrigin(origins = "*")
public class DesignationController {

    private final DesignationService designationService;

    public DesignationController(DesignationService designationService) {
        this.designationService = designationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DesignationDTO>>> getAllDesignations() {
        List<DesignationDTO> designations = designationService.getAllDesignations();
        return ResponseEntity.ok(ApiResponse.success(designations, "Designations retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DesignationDTO>> getDesignationById(@PathVariable UUID id) {
        DesignationDTO designation = designationService.getDesignationById(id);
        return ResponseEntity.ok(ApiResponse.success(designation, "Designation retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DesignationDTO>> createDesignation(@Valid @RequestBody CreateDesignationPayloadDTO payload) {
        DesignationDTO designation = designationService.createDesignation(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(designation, "Designation created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DesignationDTO>> updateDesignation(@PathVariable UUID id, @Valid @RequestBody UpdateDesignationPayloadDTO payload) {
        DesignationDTO designation = designationService.updateDesignation(id, payload);
        return ResponseEntity.ok(ApiResponse.success(designation, "Designation updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDesignation(@PathVariable UUID id) {
        designationService.deleteDesignation(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Designation deleted successfully"));
    }
}
