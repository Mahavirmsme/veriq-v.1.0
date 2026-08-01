package com.veriq.pointasset.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.pointasset.dto.CreatePointAssetRequestDTO;
import com.veriq.pointasset.dto.PointAssetResponseDTO;
import com.veriq.pointasset.service.PointAssetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/point-assets")
@CrossOrigin(origins = "*")
public class PointAssetController {

    private final PointAssetService pointAssetService;

    public PointAssetController(PointAssetService pointAssetService) {
        this.pointAssetService = pointAssetService;
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<ApiResponse<List<PointAssetResponseDTO>>> getPointAssetsByAssetId(@PathVariable UUID assetId) {
        List<PointAssetResponseDTO> pointAssets = pointAssetService.getPointAssetsByAssetId(assetId);
        return ResponseEntity.ok(ApiResponse.success(pointAssets, "Point infrastructure assets retrieved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PointAssetResponseDTO>>> getAllPointAssets() {
        List<PointAssetResponseDTO> pointAssets = pointAssetService.getAllPointAssets();
        return ResponseEntity.ok(ApiResponse.success(pointAssets, "All point infrastructure assets retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PointAssetResponseDTO>> createPointAsset(@Valid @RequestBody CreatePointAssetRequestDTO requestDTO) {
        PointAssetResponseDTO created = pointAssetService.createPointAsset(requestDTO);
        return new ResponseEntity<>(ApiResponse.success(created, "Point asset created successfully"), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePointAsset(@PathVariable UUID id) {
        pointAssetService.deletePointAsset(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Point asset deleted successfully"));
    }
}
