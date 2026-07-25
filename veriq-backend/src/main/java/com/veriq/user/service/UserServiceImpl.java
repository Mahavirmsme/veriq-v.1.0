package com.veriq.user.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.user.dto.CreateUserPayloadDTO;
import com.veriq.user.dto.UpdateUserPayloadDTO;
import com.veriq.user.dto.UserDTO;
import com.veriq.user.entity.User;
import com.veriq.user.mapper.UserMapper;
import com.veriq.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return userMapper.toDto(user);
    }

    @Override
    public UserDTO createUser(CreateUserPayloadDTO payload) {
        String email = payload.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BusinessRuleViolationException("USER_EMAIL_EXISTS", "A user with email '" + email + "' already exists.");
        }
        User user = userMapper.toEntity(payload);
        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    @Override
    public UserDTO updateUser(UUID id, UpdateUserPayloadDTO payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        user.setFirstName(payload.getFirstName().trim());
        if (payload.getLastName() != null) {
            user.setLastName(payload.getLastName().trim());
        }
        if (payload.getStatus() != null) {
            user.setStatus(payload.getStatus());
        }

        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    @Override
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        userRepository.delete(user);
    }
}
