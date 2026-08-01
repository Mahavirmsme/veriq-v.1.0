package com.veriq.department.mapper;

import com.veriq.department.dto.CreateDepartmentPayloadDTO;
import com.veriq.department.dto.DepartmentDTO;
import com.veriq.department.entity.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    public DepartmentDTO toDto(Department entity) {
        if (entity == null) {
            return null;
        }
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(entity.getId());
        dto.setOrganizationId(entity.getOrganizationId());
        dto.setName(entity.getName());
        dto.setCode(entity.getCode());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Department toEntity(CreateDepartmentPayloadDTO payload) {
        if (payload == null) {
            return null;
        }
        Department entity = new Department();
        entity.setName(payload.getName().trim());
        entity.setCode(payload.getCode().trim().toUpperCase());
        entity.setStatus(payload.getStatus() != null ? payload.getStatus() : "ACTIVE");
        return entity;
    }
}
