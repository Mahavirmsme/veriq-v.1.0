package com.veriq.commissioning.service;

import com.veriq.commissioning.dto.CommissioningRecordResponseDTO;
import com.veriq.commissioning.dto.CompleteCommissioningRequestDTO;

import java.util.UUID;

public interface CommissioningService {

    CommissioningRecordResponseDTO getCommissioningByNodeId(UUID engineeringNodeId);

    CommissioningRecordResponseDTO startCommissioning(UUID engineeringNodeId);

    CommissioningRecordResponseDTO completeCommissioning(CompleteCommissioningRequestDTO requestDTO);
}
