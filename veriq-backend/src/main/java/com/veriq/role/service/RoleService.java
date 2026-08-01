package com.veriq.role.service;

import com.veriq.role.dto.CreateRolePayloadDTO;
import com.veriq.role.dto.RoleDTO;
import com.veriq.role.dto.UpdateRolePayloadDTO;

import java.util.List;
import java.util.UUID;

public interface RoleService {

    List<RoleDTO> getAllRoles();

    RoleDTO getRoleById(UUID id);

    RoleDTO getRoleByCode(String roleCode);

    RoleDTO createRole(CreateRolePayloadDTO payload);

    RoleDTO updateRole(UUID id, UpdateRolePayloadDTO payload);

    void deleteRole(UUID id);
}
