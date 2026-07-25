package com.veriq.session.mapper;

import com.veriq.session.dto.UserSessionDTO;
import com.veriq.session.entity.UserSession;
import org.springframework.stereotype.Component;

@Component
public class UserSessionMapper {

    public UserSessionDTO toDto(UserSession entity) {
        if (entity == null) {
            return null;
        }
        UserSessionDTO dto = new UserSessionDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setSessionToken(entity.getSessionToken());
        dto.setLoginTime(entity.getLoginTime());
        dto.setLastActivityTime(entity.getLastActivityTime());
        dto.setExpiryTime(entity.getExpiryTime());
        dto.setSessionStatus(entity.getSessionStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
