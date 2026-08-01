package com.veriq.authorization.service;

import com.veriq.authorization.dto.EffectivePermissionDTO;

import java.util.UUID;

public interface EffectivePermissionService {

    EffectivePermissionDTO getEffectivePermissionsForUser(UUID userId);

    EffectivePermissionDTO getEffectivePermissionsForCurrentUser();
}
