package com.veriq.userrole.mapper;

import com.veriq.userrole.dto.UserRoleDTO;
import com.veriq.userrole.entity.UserRole;
import org.springframework.stereotype.Component;

@Component
public class UserRoleMapper {

    public UserRoleDTO toDto(UserRole entity) {
        if (entity == null) {
            return null;
        }
        UserRoleDTO dto = new UserRoleDTO();
        dto.setId(entity.getId());
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setUserEmail(entity.getUser().getEmail());
            String fullName = (entity.getUser().getFirstName() != null ? entity.getUser().getFirstName() : "")
                    + (entity.getUser().getLastName() != null ? " " + entity.getUser().getLastName() : "");
            dto.setUserName(fullName.trim());
        }
        if (entity.getRole() != null) {
            dto.setRoleId(entity.getRole().getId());
            dto.setRoleCode(entity.getRole().getRoleCode());
            dto.setRoleName(entity.getRole().getRoleName());
            dto.setSystemRole(entity.getRole().isSystemRole());
            dto.setOrganizationId(entity.getRole().getOrganizationId());
        }
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
