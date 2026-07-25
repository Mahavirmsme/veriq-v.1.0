package com.veriq.sensorpackage.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.sensorpackage.dto.SaveSensorPackageRequestDTO;
import com.veriq.sensorpackage.dto.SensorPackageResponseDTO;
import com.veriq.sensorpackage.service.SensorPackageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sensor-packages")
@CrossOrigin(origins = "*")
public class SensorPackageController {

    private final SensorPackageService sensorPackageService;

    public SensorPackageController(SensorPackageService sensorPackageService) {
        this.sensorPackageService = sensorPackageService;
    }

    @GetMapping("/node/{engineeringNodeId}")
    public ResponseEntity<ApiResponse<SensorPackageResponseDTO>> getPackageByEngineeringNodeId(@PathVariable UUID engineeringNodeId) {
        SensorPackageResponseDTO pkg = sensorPackageService.getPackageByEngineeringNodeId(engineeringNodeId);
        return ResponseEntity.ok(ApiResponse.success(pkg, "Sensor package engineering design retrieved successfully"));
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<SensorPackageResponseDTO>> saveSensorPackage(
            @Valid @RequestBody SaveSensorPackageRequestDTO requestDTO) {
        SensorPackageResponseDTO savedPkg = sensorPackageService.saveSensorPackage(requestDTO);
        return ResponseEntity.ok(ApiResponse.success(savedPkg, "Sensor package engineering design validated and saved successfully"));
    }
}
