package com.veriq.asset.controller;

import com.veriq.asset.dto.AssetResponseDTO;
import com.veriq.asset.dto.CreateAssetRequestDTO;
import com.veriq.asset.dto.UpdateAssetRequestDTO;
import com.veriq.asset.service.AssetService;
import com.veriq.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetResponseDTO>>> getAllAssets(
            @RequestParam(required = false) UUID projectId) {
        List<AssetResponseDTO> assets;
        if (projectId != null) {
            assets = assetService.getAssetsByProjectId(projectId);
        } else {
            assets = assetService.getAllAssets();
        }
        return ResponseEntity.ok(ApiResponse.success(assets, "Assets retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponseDTO>> getAssetById(@PathVariable UUID id) {
        AssetResponseDTO asset = assetService.getAssetById(id);
        return ResponseEntity.ok(ApiResponse.success(asset, "Asset retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AssetResponseDTO>> createAsset(
            @Valid @RequestBody CreateAssetRequestDTO requestDTO) {
        AssetResponseDTO createdAsset = assetService.createAsset(requestDTO);
        return new ResponseEntity<>(ApiResponse.success(createdAsset, "Asset created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponseDTO>> updateAsset(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAssetRequestDTO requestDTO) {
        AssetResponseDTO updatedAsset = assetService.updateAsset(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedAsset, "Asset updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable UUID id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Asset deleted successfully"));
    }
}
