package com.veriq.rolepermission.mapper;

import com.veriq.rolepermission.dto.RolePermissionDTO;
import com.veriq.rolepermission.entity.RolePermission;
import org.springframework.stereotype.Component;

@Component
public class RolePermissionMapper {

    public RolePermissionDTO toDto(RolePermission entity) {
        if (entity == null) {
            return null;
        }
        RolePermissionDTO dto = new RolePermissionDTO();
        dto.setId(entity.getId());
        if (entity.getRole() != null) {
            dto.setRoleId(entity.getRole().getId());
            dto.setRoleCode(entity.getRole().getRoleCode());
            dto.setRoleName(entity.getRole().getRoleName());
        }
        if (entity.getPermission() != null) {
            dto.setPermissionId(entity.getPermission().getId());
            dto.setPermissionCode(entity.getPermission().getPermissionCode());
            dto.setPermissionName(entity.getPermission().getPermissionName());
        }
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
