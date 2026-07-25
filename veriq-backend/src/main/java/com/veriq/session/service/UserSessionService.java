package com.veriq.session.service;

import com.veriq.session.dto.CreateSessionPayloadDTO;
import com.veriq.session.dto.UserSessionDTO;

import java.util.UUID;

public interface UserSessionService {
    UserSessionDTO createSession(CreateSessionPayloadDTO payload);
    UserSessionDTO getSession(UUID id);
    UserSessionDTO updateLastActivity(UUID id);
    void invalidateSession(UUID id);
}
