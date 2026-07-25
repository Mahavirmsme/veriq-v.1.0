package com.veriq.organization.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.organization.dto.CreateOrganizationRequestDTO;
import com.veriq.organization.dto.OrganizationResponseDTO;
import com.veriq.organization.dto.UpdateOrganizationRequestDTO;
import com.veriq.organization.service.OrganizationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizations")
@CrossOrigin(origins = "*")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrganizationResponseDTO>>> getAllOrganizations() {
        List<OrganizationResponseDTO> organizations = organizationService.getAllOrganizations();
        return ResponseEntity.ok(ApiResponse.success(organizations, "Organizations retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponseDTO>> getOrganizationById(@PathVariable UUID id) {
        OrganizationResponseDTO organization = organizationService.getOrganizationById(id);
        return ResponseEntity.ok(ApiResponse.success(organization, "Organization retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationResponseDTO>> createOrganization(@Valid @RequestBody CreateOrganizationRequestDTO requestDTO) {
        OrganizationResponseDTO createdOrganization = organizationService.createOrganization(requestDTO);
        return new ResponseEntity<>(ApiResponse.success(createdOrganization, "Organization created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponseDTO>> updateOrganization(@PathVariable UUID id, @Valid @RequestBody UpdateOrganizationRequestDTO requestDTO) {
        OrganizationResponseDTO updatedOrganization = organizationService.updateOrganization(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedOrganization, "Organization updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganization(@PathVariable UUID id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Organization deleted successfully"));
    }
}
