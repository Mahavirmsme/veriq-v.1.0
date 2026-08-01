package com.veriq.designation.mapper;

import com.veriq.designation.dto.CreateDesignationPayloadDTO;
import com.veriq.designation.dto.DesignationDTO;
import com.veriq.designation.entity.Designation;
import org.springframework.stereotype.Component;

@Component
public class DesignationMapper {

    public DesignationDTO toDto(Designation entity) {
        if (entity == null) {
            return null;
        }
        DesignationDTO dto = new DesignationDTO();
        dto.setId(entity.getId());
        dto.setOrganizationId(entity.getOrganizationId());
        dto.setTitle(entity.getTitle());
        dto.setCode(entity.getCode());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Designation toEntity(CreateDesignationPayloadDTO payload) {
        if (payload == null) {
            return null;
        }
        Designation entity = new Designation();
        entity.setTitle(payload.getTitle().trim());
        entity.setCode(payload.getCode().trim().toUpperCase());
        entity.setStatus(payload.getStatus() != null ? payload.getStatus() : "ACTIVE");
        return entity;
    }
}
