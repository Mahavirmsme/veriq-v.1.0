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
            dto.setUserName(entity.getUser().getFirstName() + (entity.getUser().getLastName() != null ? " " + entity.getUser().getLastName() : ""));
        }
        if (entity.getRole() != null) {
            dto.setRoleId(entity.getRole().getId());
            dto.setRoleCode(entity.getRole().getRoleCode());
            dto.setRoleName(entity.getRole().getRoleName());
        }
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
