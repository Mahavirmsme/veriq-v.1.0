package com.veriq.userrole.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.role.entity.Role;
import com.veriq.role.repository.RoleRepository;
import com.veriq.user.entity.User;
import com.veriq.user.repository.UserRepository;
import com.veriq.userrole.dto.CreateUserRolePayloadDTO;
import com.veriq.userrole.dto.UserRoleDTO;
import com.veriq.userrole.entity.UserRole;
import com.veriq.userrole.mapper.UserRoleMapper;
import com.veriq.userrole.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserRoleServiceImpl implements UserRoleService {

    private final UserRoleRepository userRoleRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleMapper userRoleMapper;

    public UserRoleServiceImpl(UserRoleRepository userRoleRepository,
                                UserRepository userRepository,
                                RoleRepository roleRepository,
                                UserRoleMapper userRoleMapper) {
        this.userRoleRepository = userRoleRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleMapper = userRoleMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRoleDTO> getAllUserRoles() {
        return userRoleRepository.findAll().stream()
                .map(userRoleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserRoleDTO getUserRoleById(UUID id) {
        UserRole ur = userRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserRole", "id", id));
        return userRoleMapper.toDto(ur);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRoleDTO> getUserRolesByUserId(UUID userId) {
        return userRoleRepository.findByUserId(userId).stream()
                .map(userRoleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserRoleDTO createUserRole(CreateUserRolePayloadDTO payload) {
        User user = userRepository.findById(payload.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", payload.getUserId()));

        Role role = roleRepository.findById(payload.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", payload.getRoleId()));

        if (userRoleRepository.existsByUserIdAndRoleId(payload.getUserId(), payload.getRoleId())) {
            throw new BusinessRuleViolationException("USER_ROLE_EXISTS", "Mapping between this User and Role already exists.");
        }

        UserRole ur = new UserRole();
        ur.setUser(user);
        ur.setRole(role);

        UserRole saved = userRoleRepository.save(ur);
        return userRoleMapper.toDto(saved);
    }

    @Override
    public UserRoleDTO updateUserRole(UUID id, CreateUserRolePayloadDTO payload) {
        UserRole ur = userRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserRole", "id", id));

        User user = userRepository.findById(payload.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", payload.getUserId()));

        Role role = roleRepository.findById(payload.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", payload.getRoleId()));

        ur.setUser(user);
        ur.setRole(role);

        UserRole saved = userRoleRepository.save(ur);
        return userRoleMapper.toDto(saved);
    }

    @Override
    public void deleteUserRole(UUID id) {
        UserRole ur = userRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserRole", "id", id));

        userRoleRepository.delete(ur);
    }
}
