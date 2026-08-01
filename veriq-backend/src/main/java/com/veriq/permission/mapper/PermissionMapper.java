package com.veriq.permission.mapper;

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
        dto.setCategory(entity.getCategory());
        dto.setDisplayName(entity.getDisplayName());
        dto.setDescription(entity.getDescription());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
