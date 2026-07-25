package com.veriq.commissioning.mapper;

import com.veriq.commissioning.dto.CommissioningRecordResponseDTO;
import com.veriq.commissioning.entity.CommissioningRecord;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CommissioningMapper {

    public CommissioningRecordResponseDTO toDto(CommissioningRecord entity) {
        if (entity == null) {
            return null;
        }
        CommissioningRecordResponseDTO dto = new CommissioningRecordResponseDTO();
        dto.setId(entity.getId());
        if (entity.getEngineeringNode() != null) {
            dto.setEngineeringNodeId(entity.getEngineeringNode().getId());
            dto.setNodeCode(entity.getEngineeringNode().getNodeCode());
            dto.setNodeNumber(entity.getEngineeringNode().getNodeNumber());
        }
        if (entity.getSensorPackage() != null) {
            dto.setSensorPackageId(entity.getSensorPackage().getId());
        }
        dto.setStatus(entity.getStatus());
        dto.setRemarks(entity.getRemarks());
        dto.setCommissionedDate(entity.getCommissionedDate());

        if (entity.getRuntimeSensors() != null) {
            dto.setRuntimeSensors(entity.getRuntimeSensors().stream().map(s -> {
                CommissioningRecordResponseDTO.RuntimeSensorResponseDTO sDto = new CommissioningRecordResponseDTO.RuntimeSensorResponseDTO();
                sDto.setId(s.getId());
                sDto.setSensorCode(s.getSensorCode());
                sDto.setSensorType(s.getSensorType());
                sDto.setMeasurementParameter(s.getMeasurementParameter());
                sDto.setSensorStatus(s.getSensorStatus());
                return sDto;
            }).collect(Collectors.toList()));
        }

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
