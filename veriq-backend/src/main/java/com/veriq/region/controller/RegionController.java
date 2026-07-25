package com.veriq.region.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.region.dto.RegionResponseDTO;
import com.veriq.region.dto.SaveRegionsRequestDTO;
import com.veriq.region.service.RegionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/regions")
@CrossOrigin(origins = "*")
public class RegionController {

    private final RegionService regionService;

    public RegionController(RegionService regionService) {
        this.regionService = regionService;
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<ApiResponse<List<RegionResponseDTO>>> getRegionsByAssetId(@PathVariable UUID assetId) {
        List<RegionResponseDTO> regions = regionService.getRegionsByAssetId(assetId);
        return ResponseEntity.ok(ApiResponse.success(regions, "Region engineering design retrieved successfully"));
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<List<RegionResponseDTO>>> saveRegions(
            @Valid @RequestBody SaveRegionsRequestDTO requestDTO) {
        List<RegionResponseDTO> savedRegions = regionService.saveRegions(requestDTO);
        return ResponseEntity.ok(ApiResponse.success(savedRegions, "Region engineering design validated and saved successfully"));
    }
}
