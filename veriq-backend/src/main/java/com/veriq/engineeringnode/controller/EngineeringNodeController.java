package com.veriq.engineeringnode.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.engineeringnode.dto.EngineeringNodeResponseDTO;
import com.veriq.engineeringnode.dto.SaveEngineeringNodesRequestDTO;
import com.veriq.engineeringnode.service.EngineeringNodeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/engineering-nodes")
@CrossOrigin(origins = "*")
public class EngineeringNodeController {

    private final EngineeringNodeService engineeringNodeService;

    public EngineeringNodeController(EngineeringNodeService engineeringNodeService) {
        this.engineeringNodeService = engineeringNodeService;
    }

    @GetMapping("/zone/{deploymentZoneId}")
    public ResponseEntity<ApiResponse<List<EngineeringNodeResponseDTO>>> getNodesByDeploymentZoneId(
            @PathVariable UUID deploymentZoneId,
            @RequestParam(required = false, defaultValue = "false") boolean commissionedOnly) {
        List<EngineeringNodeResponseDTO> nodes = engineeringNodeService.getNodesByDeploymentZoneId(deploymentZoneId, commissionedOnly);
        return ResponseEntity.ok(ApiResponse.success(nodes, "Engineering node design retrieved successfully"));
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<List<EngineeringNodeResponseDTO>>> saveEngineeringNodes(
            @Valid @RequestBody SaveEngineeringNodesRequestDTO requestDTO) {
        List<EngineeringNodeResponseDTO> savedNodes = engineeringNodeService.saveEngineeringNodes(requestDTO);
        return ResponseEntity.ok(ApiResponse.success(savedNodes, "Engineering node design validated and saved successfully"));
    }
}
