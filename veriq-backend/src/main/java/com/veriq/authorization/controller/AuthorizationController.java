package com.veriq.authorization.controller;

import com.veriq.authorization.dto.AuthorizationRequestDTO;
import com.veriq.authorization.dto.AuthorizationResponseDTO;
import com.veriq.authorization.service.AuthorizationService;
import com.veriq.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthorizationController {

    private final AuthorizationService authorizationService;

    public AuthorizationController(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @PostMapping("/authorize")
    public ResponseEntity<ApiResponse<AuthorizationResponseDTO>> authorize(@Valid @RequestBody AuthorizationRequestDTO request) {
        AuthorizationResponseDTO response = authorizationService.authorize(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Authorization permissions retrieved successfully"));
    }
}
