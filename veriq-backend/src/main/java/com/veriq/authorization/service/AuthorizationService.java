package com.veriq.authorization.service;

import com.veriq.authorization.dto.AuthorizationRequestDTO;
import com.veriq.authorization.dto.AuthorizationResponseDTO;

public interface AuthorizationService {
    AuthorizationResponseDTO authorize(AuthorizationRequestDTO request);
}
