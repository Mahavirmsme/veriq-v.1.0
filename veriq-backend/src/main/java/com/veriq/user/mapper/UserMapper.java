package com.veriq.user.mapper;

import com.veriq.user.dto.CreateUserPayloadDTO;
import com.veriq.user.dto.UserDTO;
import com.veriq.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDto(User entity) {
        if (entity == null) {
            return null;
        }
        UserDTO dto = new UserDTO();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public User toEntity(CreateUserPayloadDTO payload) {
        if (payload == null) {
            return null;
        }
        User entity = new User();
        entity.setFirstName(payload.getFirstName().trim());
        entity.setLastName(payload.getLastName() != null ? payload.getLastName().trim() : null);
        entity.setEmail(payload.getEmail().trim().toLowerCase());
        entity.setPasswordHash(payload.getPasswordHash());
        entity.setStatus(payload.getStatus() != null ? payload.getStatus() : "ACTIVE");
        return entity;
    }
}
