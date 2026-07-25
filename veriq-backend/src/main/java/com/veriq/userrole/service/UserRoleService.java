package com.veriq.userrole.service;

import com.veriq.userrole.dto.CreateUserRolePayloadDTO;
import com.veriq.userrole.dto.UserRoleDTO;

import java.util.List;
import java.util.UUID;

public interface UserRoleService {
    List<UserRoleDTO> getAllUserRoles();
    UserRoleDTO getUserRoleById(UUID id);
    List<UserRoleDTO> getUserRolesByUserId(UUID userId);
    UserRoleDTO createUserRole(CreateUserRolePayloadDTO payload);
    UserRoleDTO updateUserRole(UUID id, CreateUserRolePayloadDTO payload);
    void deleteUserRole(UUID id);
}
