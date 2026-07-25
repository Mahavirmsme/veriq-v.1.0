package com.veriq.auth.service;

import com.veriq.auth.dto.LoginRequestDTO;
import com.veriq.auth.dto.LoginResponseDTO;

public interface AuthenticationService {
    LoginResponseDTO authenticate(LoginRequestDTO request);
}
