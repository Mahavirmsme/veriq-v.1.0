package com.veriq.commissioning.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.commissioning.dto.CommissioningRecordResponseDTO;
import com.veriq.commissioning.dto.CompleteCommissioningRequestDTO;
import com.veriq.commissioning.service.CommissioningService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/commissioning")
@CrossOrigin(origins = "*")
public class CommissioningController {

    private final CommissioningService commissioningService;

    public CommissioningController(CommissioningService commissioningService) {
        this.commissioningService = commissioningService;
    }

    @GetMapping("/node/{engineeringNodeId}")
    public ResponseEntity<ApiResponse<CommissioningRecordResponseDTO>> getCommissioningByNodeId(@PathVariable UUID engineeringNodeId) {
        CommissioningRecordResponseDTO record = commissioningService.getCommissioningByNodeId(engineeringNodeId);
        return ResponseEntity.ok(ApiResponse.success(record, "Commissioning record retrieved successfully"));
    }

    @PostMapping("/start/{engineeringNodeId}")
    public ResponseEntity<ApiResponse<CommissioningRecordResponseDTO>> startCommissioning(@PathVariable UUID engineeringNodeId) {
        CommissioningRecordResponseDTO record = commissioningService.startCommissioning(engineeringNodeId);
        return ResponseEntity.ok(ApiResponse.success(record, "Commissioning process started successfully"));
    }

    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<CommissioningRecordResponseDTO>> completeCommissioning(
            @Valid @RequestBody CompleteCommissioningRequestDTO requestDTO) {
        CommissioningRecordResponseDTO record = commissioningService.completeCommissioning(requestDTO);
        return ResponseEntity.ok(ApiResponse.success(record, "Commissioning process completed and runtime sensors generated successfully"));
    }
}
