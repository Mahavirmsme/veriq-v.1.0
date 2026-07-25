package com.veriq.user.service;

import com.veriq.user.dto.CreateUserPayloadDTO;
import com.veriq.user.dto.UpdateUserPayloadDTO;
import com.veriq.user.dto.UserDTO;

import java.util.List;
import java.util.UUID;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(UUID id);
    UserDTO getUserByEmail(String email);
    UserDTO createUser(CreateUserPayloadDTO payload);
    UserDTO updateUser(UUID id, UpdateUserPayloadDTO payload);
    void deleteUser(UUID id);
}
