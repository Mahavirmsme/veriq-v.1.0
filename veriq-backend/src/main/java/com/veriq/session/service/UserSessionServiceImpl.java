package com.veriq.session.service;

import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.session.dto.CreateSessionPayloadDTO;
import com.veriq.session.dto.UserSessionDTO;
import com.veriq.session.entity.UserSession;
import com.veriq.session.mapper.UserSessionMapper;
import com.veriq.session.repository.UserSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@Transactional
public class UserSessionServiceImpl implements UserSessionService {

    private final UserSessionRepository userSessionRepository;
    private final UserSessionMapper userSessionMapper;

    public UserSessionServiceImpl(UserSessionRepository userSessionRepository, UserSessionMapper userSessionMapper) {
        this.userSessionRepository = userSessionRepository;
        this.userSessionMapper = userSessionMapper;
    }

    @Override
    public UserSessionDTO createSession(CreateSessionPayloadDTO payload) {
        UserSession session = new UserSession();
        session.setUserId(payload.getUserId());
        session.setSessionToken("veriq_sess_" + UUID.randomUUID().toString().replace("-", ""));

        long minutes = payload.getDurationMinutes() != null ? payload.getDurationMinutes() : 480L;
        session.setExpiryTime(OffsetDateTime.now().plusMinutes(minutes));
        session.setSessionStatus("ACTIVE");

        UserSession saved = userSessionRepository.save(session);
        return userSessionMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserSessionDTO getSession(UUID id) {
        UserSession session = userSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserSession", "id", id));
        return userSessionMapper.toDto(session);
    }

    @Override
    public UserSessionDTO updateLastActivity(UUID id) {
        UserSession session = userSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserSession", "id", id));

        session.setLastActivityTime(OffsetDateTime.now());

        if (OffsetDateTime.now().isAfter(session.getExpiryTime())) {
            session.setSessionStatus("EXPIRED");
        }

        UserSession saved = userSessionRepository.save(session);
        return userSessionMapper.toDto(saved);
    }

    @Override
    public void invalidateSession(UUID id) {
        UserSession session = userSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserSession", "id", id));

        session.setSessionStatus("INVALIDATED");
        userSessionRepository.save(session);
    }
}
