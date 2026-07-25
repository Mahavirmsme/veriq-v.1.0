package com.veriq.assetstate.controller;

import com.veriq.assetstate.dto.AssetStateDTO;
import com.veriq.assetstate.service.AssetStateRepositoryService;
import com.veriq.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/asset-states")
@CrossOrigin(origins = "*")
public class AssetStateController {

    private final AssetStateRepositoryService assetStateRepositoryService;

    public AssetStateController(AssetStateRepositoryService assetStateRepositoryService) {
        this.assetStateRepositoryService = assetStateRepositoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetStateDTO>>> getAllAssetStates() {
        List<AssetStateDTO> states = assetStateRepositoryService.getAllAssetStates();
        return ResponseEntity.ok(ApiResponse.success(states, "Latest Asset health states retrieved from Asset State Repository"));
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<ApiResponse<AssetStateDTO>> getLatestAssetState(@PathVariable UUID assetId) {
        AssetStateDTO state = assetStateRepositoryService.getLatestAssetState(assetId);
        return ResponseEntity.ok(ApiResponse.success(state, "Latest Asset state retrieved"));
    }
}
