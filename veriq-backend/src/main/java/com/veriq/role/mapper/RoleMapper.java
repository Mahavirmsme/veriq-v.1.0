package com.veriq.role.mapper;

import com.veriq.role.dto.CreateRolePayloadDTO;
import com.veriq.role.dto.RoleDTO;
import com.veriq.role.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public RoleDTO toDto(Role entity) {
        if (entity == null) {
            return null;
        }
        RoleDTO dto = new RoleDTO();
        dto.setId(entity.getId());
        dto.setOrganizationId(entity.getOrganizationId());
        dto.setRoleCode(entity.getRoleCode());
        dto.setRoleName(entity.getRoleName());
        dto.setRoleDescription(entity.getRoleDescription());
        dto.setSystemRole(entity.isSystemRole());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Role toEntity(CreateRolePayloadDTO payload) {
        if (payload == null) {
            return null;
        }
        Role entity = new Role();
        entity.setRoleCode(payload.getRoleCode().trim().toUpperCase());
        entity.setRoleName(payload.getRoleName().trim());
        entity.setRoleDescription(payload.getRoleDescription() != null ? payload.getRoleDescription().trim() : null);
        entity.setStatus(payload.getStatus() != null ? payload.getStatus() : "ACTIVE");
        entity.setSystemRole(false);
        return entity;
    }
}
