package com.veriq.session.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.session.dto.CreateSessionPayloadDTO;
import com.veriq.session.dto.UserSessionDTO;
import com.veriq.session.service.UserSessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessions")
@CrossOrigin(origins = "*")
public class UserSessionController {

    private final UserSessionService userSessionService;

    public UserSessionController(UserSessionService userSessionService) {
        this.userSessionService = userSessionService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserSessionDTO>> getSession(@PathVariable UUID id) {
        UserSessionDTO dto = userSessionService.getSession(id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Session retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserSessionDTO>> createSession(@Valid @RequestBody CreateSessionPayloadDTO payload) {
        UserSessionDTO dto = userSessionService.createSession(payload);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Session created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserSessionDTO>> updateLastActivity(@PathVariable UUID id) {
        UserSessionDTO dto = userSessionService.updateLastActivity(id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Session activity updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> invalidateSession(@PathVariable UUID id) {
        userSessionService.invalidateSession(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Session invalidated successfully"));
    }
}
