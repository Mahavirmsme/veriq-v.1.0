package com.veriq.sensorpackage.mapper;

import com.veriq.sensorpackage.dto.SensorPackageItemDTO;
import com.veriq.sensorpackage.dto.SensorPackageResponseDTO;
import com.veriq.sensorpackage.entity.SensorPackage;
import com.veriq.sensorpackage.entity.SensorPackageItem;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class SensorPackageMapper {

    public SensorPackageResponseDTO toDto(SensorPackage entity) {
        if (entity == null) {
            return null;
        }
        SensorPackageResponseDTO dto = new SensorPackageResponseDTO();
        dto.setId(entity.getId());
        if (entity.getEngineeringNode() != null) {
            dto.setEngineeringNodeId(entity.getEngineeringNode().getId());
            dto.setNodeCode(entity.getEngineeringNode().getNodeCode());
            dto.setNodeNumber(entity.getEngineeringNode().getNodeNumber());
        }
        dto.setPackageStatus(entity.getPackageStatus());

        if (entity.getItems() != null) {
            dto.setTotalSensorTypes(entity.getItems().size());
            int count = entity.getItems().stream().mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0).sum();
            dto.setTotalSensorCount(count);

            dto.setItems(entity.getItems().stream().map(item -> {
                SensorPackageResponseDTO.SensorPackageItemResponseDTO itemDto = new SensorPackageResponseDTO.SensorPackageItemResponseDTO();
                itemDto.setId(item.getId());
                itemDto.setSensorType(item.getSensorType());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setMeasurementParameter(item.getMeasurementParameter());
                itemDto.setEngineeringPurpose(item.getEngineeringPurpose());
                itemDto.setRemarks(item.getRemarks());
                return itemDto;
            }).collect(Collectors.toList()));
        }

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public SensorPackageItem toEntity(SensorPackageItemDTO dto, SensorPackage pkg) {
        if (dto == null) {
            return null;
        }
        SensorPackageItem entity = new SensorPackageItem();
        entity.setSensorPackage(pkg);
        entity.setSensorType(dto.getSensorType() != null ? dto.getSensorType().trim() : null);
        entity.setQuantity(dto.getQuantity() != null && dto.getQuantity() > 0 ? dto.getQuantity() : 1);
        entity.setMeasurementParameter(dto.getMeasurementParameter());
        entity.setEngineeringPurpose(dto.getEngineeringPurpose());
        entity.setRemarks(dto.getRemarks());
        return entity;
    }
}
