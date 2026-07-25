package com.veriq.auth.controller;

import com.veriq.auth.dto.LoginRequestDTO;
import com.veriq.auth.dto.LoginResponseDTO;
import com.veriq.auth.service.AuthenticationService;
import com.veriq.common.dto.ApiResponse;
import com.veriq.common.dto.ErrorDetail;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authenticationService.authenticate(request);

        if (!response.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication failed", new ErrorDetail("AUTHENTICATION_FAILED", response.getMessage())));
        }

        return ResponseEntity.ok(ApiResponse.success(response, response.getMessage()));
    }
}
