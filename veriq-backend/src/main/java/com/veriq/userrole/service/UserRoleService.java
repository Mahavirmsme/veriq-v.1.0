package com.veriq.userrole.service;

import com.veriq.userrole.dto.*;

import java.util.List;
import java.util.UUID;

public interface UserRoleService {
    UserRolesResponseDTO assignRolesToUser(UUID userId, AssignRolesRequestDTO request);
    UserRoleDTO assignSingleRoleToUser(UUID userId, UUID roleId);
    void removeRoleFromUser(UUID userId, UUID roleId);
    void removeRolesFromUser(UUID userId, List<UUID> roleIds);
    UserRolesResponseDTO getRolesForUser(UUID userId);
    RoleUsersResponseDTO getUsersForRole(UUID roleId);
    List<UserRoleDTO> getAllUserRoles();
    UserRoleDTO getUserRoleById(UUID id);
    List<UserRoleDTO> getUserRolesByUserId(UUID userId);
    UserRoleDTO createUserRole(CreateUserRolePayloadDTO payload);
    UserRoleDTO updateUserRole(UUID id, CreateUserRolePayloadDTO payload);
    void deleteUserRole(UUID id);
}
