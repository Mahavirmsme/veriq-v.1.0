package com.veriq.regionstate.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.regionstate.dto.RegionStateDTO;
import com.veriq.regionstate.service.RegionStateRepositoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/region-states")
@CrossOrigin(origins = "*")
public class RegionStateController {

    private final RegionStateRepositoryService regionStateRepositoryService;

    public RegionStateController(RegionStateRepositoryService regionStateRepositoryService) {
        this.regionStateRepositoryService = regionStateRepositoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RegionStateDTO>>> getAllRegionStates() {
        List<RegionStateDTO> states = regionStateRepositoryService.getAllRegionStates();
        return ResponseEntity.ok(ApiResponse.success(states, "Latest Region health states retrieved from Region State Repository"));
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<ApiResponse<RegionStateDTO>> getLatestRegionState(@PathVariable UUID regionId) {
        RegionStateDTO state = regionStateRepositoryService.getLatestRegionState(regionId);
        return ResponseEntity.ok(ApiResponse.success(state, "Latest Region state retrieved"));
    }
}
