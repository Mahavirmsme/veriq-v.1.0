package com.veriq.permission.service;

import com.veriq.permission.dto.PermissionDTO;

import java.util.List;
import java.util.UUID;

public interface PermissionService {

    List<PermissionDTO> getAllPermissions();

    PermissionDTO getPermissionById(UUID id);

    PermissionDTO getPermissionByCode(String code);

    List<PermissionDTO> getPermissionsByCategory(String category);
}
