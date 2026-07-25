package com.veriq.permission.mapper;

import com.veriq.permission.dto.CreatePermissionPayloadDTO;
import com.veriq.permission.dto.PermissionDTO;
import com.veriq.permission.entity.Permission;
import org.springframework.stereotype.Component;

@Component
public class PermissionMapper {

    public PermissionDTO toDto(Permission entity) {
        if (entity == null) {
            return null;
        }
        PermissionDTO dto = new PermissionDTO();
        dto.setId(entity.getId());
        dto.setPermissionCode(entity.getPermissionCode());
        dto.setPermissionName(entity.getPermissionName());
        dto.setPermissionDescription(entity.getPermissionDescription());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Permission toEntity(CreatePermissionPayloadDTO payload) {
        if (payload == null) {
            return null;
        }
        Permission entity = new Permission();
        entity.setPermissionCode(payload.getPermissionCode().trim().toUpperCase());
        entity.setPermissionName(payload.getPermissionName().trim());
        entity.setPermissionDescription(payload.getPermissionDescription());
        return entity;
    }
}
