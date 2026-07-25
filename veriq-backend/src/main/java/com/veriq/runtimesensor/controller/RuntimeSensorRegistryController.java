package com.veriq.runtimesensor.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.runtimesensor.dto.RuntimeSensorRegistryResponseDTO;
import com.veriq.runtimesensor.dto.TransitionStatusRequestDTO;
import com.veriq.runtimesensor.model.RuntimeSensorStatus;
import com.veriq.runtimesensor.service.RuntimeSensorRegistryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/runtime-sensors")
@CrossOrigin(origins = "*")
public class RuntimeSensorRegistryController {

    private final RuntimeSensorRegistryService runtimeSensorRegistryService;

    public RuntimeSensorRegistryController(RuntimeSensorRegistryService runtimeSensorRegistryService) {
        this.runtimeSensorRegistryService = runtimeSensorRegistryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RuntimeSensorRegistryResponseDTO>>> getAllRuntimeSensors() {
        List<RuntimeSensorRegistryResponseDTO> sensors = runtimeSensorRegistryService.getAllRuntimeSensors();
        return ResponseEntity.ok(ApiResponse.success(sensors, "Runtime sensor registry retrieved successfully"));
    }

    @GetMapping("/node/{engineeringNodeId}")
    public ResponseEntity<ApiResponse<List<RuntimeSensorRegistryResponseDTO>>> getSensorsByNodeId(@PathVariable UUID engineeringNodeId) {
        List<RuntimeSensorRegistryResponseDTO> sensors = runtimeSensorRegistryService.getSensorsByNodeId(engineeringNodeId);
        return ResponseEntity.ok(ApiResponse.success(sensors, "Runtime sensors for engineering node retrieved successfully"));
    }

    @PostMapping("/{sensorId}/transition")
    public ResponseEntity<ApiResponse<RuntimeSensorRegistryResponseDTO>> transitionStatus(
            @PathVariable UUID sensorId,
            @RequestBody TransitionStatusRequestDTO requestDTO) {
        RuntimeSensorStatus statusEnum = RuntimeSensorStatus.valueOf(requestDTO.getTargetStatus().toUpperCase().replaceAll(" ", "_"));
        RuntimeSensorRegistryResponseDTO updated = runtimeSensorRegistryService.transitionStatus(sensorId, statusEnum, requestDTO.getReason());
        return ResponseEntity.ok(ApiResponse.success(updated, "Runtime Sensor transition to " + statusEnum.getDisplayName() + " successful"));
    }
}
