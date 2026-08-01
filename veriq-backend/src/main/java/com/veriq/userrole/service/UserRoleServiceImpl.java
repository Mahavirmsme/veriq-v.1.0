package com.veriq.userrole.service;

import com.veriq.common.context.TenantContextResolver;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.role.dto.RoleDTO;
import com.veriq.role.entity.Role;
import com.veriq.role.mapper.RoleMapper;
import com.veriq.role.repository.RoleRepository;
import com.veriq.user.dto.UserDTO;
import com.veriq.user.entity.User;
import com.veriq.user.mapper.UserMapper;
import com.veriq.user.repository.UserRepository;
import com.veriq.userrole.dto.*;
import com.veriq.userrole.entity.UserRole;
import com.veriq.userrole.mapper.UserRoleMapper;
import com.veriq.userrole.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserRoleServiceImpl implements UserRoleService {

    private final UserRoleRepository userRoleRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleMapper userRoleMapper;
    private final RoleMapper roleMapper;
    private final UserMapper userMapper;
    private final TenantContextResolver tenantContextResolver;

    public UserRoleServiceImpl(UserRoleRepository userRoleRepository,
                                UserRepository userRepository,
                                RoleRepository roleRepository,
                                UserRoleMapper userRoleMapper,
                                RoleMapper roleMapper,
                                UserMapper userMapper,
                                TenantContextResolver tenantContextResolver) {
        this.userRoleRepository = userRoleRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleMapper = userRoleMapper;
        this.roleMapper = roleMapper;
        this.userMapper = userMapper;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Override
    public UserRolesResponseDTO assignRolesToUser(UUID userId, AssignRolesRequestDTO request) {
        User user = resolveUser(userId);

        List<Role> rolesToAssign = new ArrayList<>();

        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            for (UUID rId : request.getRoleIds()) {
                Role r = roleRepository.findById(rId)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "id", rId));
                rolesToAssign.add(r);
            }
        }

        if (request.getRoleCodes() != null && !request.getRoleCodes().isEmpty()) {
            for (String code : request.getRoleCodes()) {
                Role r = roleRepository.findByRoleCode(code.trim())
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "roleCode", code));
                if (!rolesToAssign.contains(r)) {
                    rolesToAssign.add(r);
                }
            }
        }

        for (Role role : rolesToAssign) {
            validateUserRoleAssignment(user, role);
            if (!userRoleRepository.existsByUserIdAndRoleId(user.getId(), role.getId())) {
                UserRole mapping = new UserRole(user, role);
                userRoleRepository.save(mapping);
            }
        }

        return getRolesForUser(user.getId());
    }

    @Override
    public UserRoleDTO assignSingleRoleToUser(UUID userId, UUID roleId) {
        User user = resolveUser(userId);
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

        validateUserRoleAssignment(user, role);

        Optional<UserRole> existing = userRoleRepository.findByUserIdAndRoleId(userId, roleId);
        if (existing.isPresent()) {
            return userRoleMapper.toDto(existing.get());
        }

        UserRole mapping = new UserRole(user, role);
        UserRole saved = userRoleRepository.save(mapping);
        return userRoleMapper.toDto(saved);
    }

    @Override
    public void removeRoleFromUser(UUID userId, UUID roleId) {
        resolveUser(userId);
        if (!roleRepository.existsById(roleId)) {
            throw new ResourceNotFoundException("Role", "id", roleId);
        }
        userRoleRepository.deleteByUserIdAndRoleId(userId, roleId);
    }

    @Override
    public void removeRolesFromUser(UUID userId, List<UUID> roleIds) {
        resolveUser(userId);
        if (roleIds != null) {
            for (UUID rId : roleIds) {
                userRoleRepository.deleteByUserIdAndRoleId(userId, rId);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserRolesResponseDTO getRolesForUser(UUID userId) {
        User user = resolveUser(userId);

        List<RoleDTO> assignedRoles = userRoleRepository.findByUserId(userId).stream()
                .map(UserRole::getRole)
                .map(roleMapper::toDto)
                .collect(Collectors.toList());

        String fullName = (user.getFirstName() != null ? user.getFirstName() : "")
                + (user.getLastName() != null ? " " + user.getLastName() : "");

        return new UserRolesResponseDTO(
                user.getId(),
                user.getEmail(),
                fullName.trim(),
                user.getOrganizationId(),
                assignedRoles
        );
    }

    @Override
    @Transactional(readOnly = true)
    public RoleUsersResponseDTO getUsersForRole(UUID roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", roleId));

        Optional<UUID> tenantOrgId = tenantContextResolver.resolveCurrentOrganizationId();

        List<UserDTO> assignedUsers = userRoleRepository.findByRoleId(roleId).stream()
                .map(UserRole::getUser)
                .filter(u -> tenantOrgId.map(orgId -> orgId.equals(u.getOrganizationId())).orElse(true))
                .map(userMapper::toDto)
                .collect(Collectors.toList());

        return new RoleUsersResponseDTO(
                role.getId(),
                role.getRoleCode(),
                role.getRoleName(),
                role.isSystemRole(),
                role.getOrganizationId(),
                assignedUsers
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRoleDTO> getAllUserRoles() {
        Optional<UUID> tenantOrgId = tenantContextResolver.resolveCurrentOrganizationId();

        return userRoleRepository.findAll().stream()
                .filter(ur -> {
                    User u = ur.getUser();
                    if (u == null) return false;
                    return tenantOrgId.map(orgId -> orgId.equals(u.getOrganizationId())).orElse(true);
                })
                .map(userRoleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserRoleDTO getUserRoleById(UUID id) {
        UserRole ur = userRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserRole", "id", id));
        resolveUser(ur.getUser().getId());
        return userRoleMapper.toDto(ur);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRoleDTO> getUserRolesByUserId(UUID userId) {
        resolveUser(userId);
        return userRoleRepository.findByUserId(userId).stream()
                .map(userRoleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserRoleDTO createUserRole(CreateUserRolePayloadDTO payload) {
        return assignSingleRoleToUser(payload.getUserId(), payload.getRoleId());
    }

    @Override
    public UserRoleDTO updateUserRole(UUID id, CreateUserRolePayloadDTO payload) {
        UserRole ur = userRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserRole", "id", id));

        User user = resolveUser(payload.getUserId());
        Role role = roleRepository.findById(payload.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", payload.getRoleId()));

        validateUserRoleAssignment(user, role);

        ur.setUser(user);
        ur.setRole(role);

        UserRole saved = userRoleRepository.save(ur);
        return userRoleMapper.toDto(saved);
    }

    @Override
    public void deleteUserRole(UUID id) {
        UserRole ur = userRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserRole", "id", id));
        resolveUser(ur.getUser().getId());
        userRoleRepository.delete(ur);
    }

    private User resolveUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Optional<UUID> currentOrgId = tenantContextResolver.resolveCurrentOrganizationId();
        if (currentOrgId.isPresent() && !currentOrgId.get().equals(user.getOrganizationId())) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        return user;
    }

    private void validateUserRoleAssignment(User user, Role role) {
        if (!role.isSystemRole()) {
            if (role.getOrganizationId() != null && user.getOrganizationId() != null
                    && !role.getOrganizationId().equals(user.getOrganizationId())) {
                throw new BusinessRuleViolationException("TENANT_MISMATCH",
                        "Cannot assign organization role " + role.getRoleCode() + " to user in different organization.");
            }
        }
    }
}
