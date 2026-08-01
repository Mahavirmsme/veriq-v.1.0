package com.veriq.user.service;

import com.veriq.common.context.TenantContextResolver;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.role.entity.Role;
import com.veriq.role.repository.RoleRepository;
import com.veriq.user.dto.CreateUserPayloadDTO;
import com.veriq.user.dto.UpdateUserPayloadDTO;
import com.veriq.user.dto.UserDTO;
import com.veriq.user.entity.User;
import com.veriq.user.mapper.UserMapper;
import com.veriq.user.repository.UserRepository;
import com.veriq.userrole.entity.UserRole;
import com.veriq.userrole.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final TenantContextResolver tenantContextResolver;

    public UserServiceImpl(UserRepository userRepository,
                           UserRoleRepository userRoleRepository,
                           RoleRepository roleRepository,
                           UserMapper userMapper,
                           TenantContextResolver tenantContextResolver) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        UUID sessionOrgId = resolveSessionOrganizationId();
        List<User> users = (sessionOrgId != null) 
                ? userRepository.findByOrganizationId(sessionOrgId)
                : userRepository.findAll();

        return users.stream()
                .map(this::enrichUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return enrichUserDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return enrichUserDTO(user);
    }

    @Override
    public UserDTO createUser(CreateUserPayloadDTO payload) {
        String email = payload.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BusinessRuleViolationException("USER_EMAIL_EXISTS", "A user with email '" + email + "' already exists.");
        }
        User user = userMapper.toEntity(payload);

        // Resolve organization_id strictly server-side from TenantContextResolver contract
        UUID sessionOrgId = resolveSessionOrganizationId();
        user.setOrganizationId(sessionOrgId);

        User saved = userRepository.save(user);

        saveUserRoles(saved, payload.getAssignedRoles());

        return enrichUserDTO(saved);
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
        if (payload.getDepartmentId() != null) {
            user.setDepartmentId(payload.getDepartmentId());
        }
        if (payload.getDesignationId() != null) {
            user.setDesignationId(payload.getDesignationId());
        }

        User saved = userRepository.save(user);

        if (payload.getAssignedRoles() != null) {
            List<UserRole> existingRoles = userRoleRepository.findByUserId(id);
            userRoleRepository.deleteAll(existingRoles);
            saveUserRoles(saved, payload.getAssignedRoles());
        }

        return enrichUserDTO(saved);
    }

    @Override
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        List<UserRole> roles = userRoleRepository.findByUserId(id);
        userRoleRepository.deleteAll(roles);

        userRepository.delete(user);
    }

    private UUID resolveSessionOrganizationId() {
        return tenantContextResolver.resolveCurrentOrganizationId().orElse(null);
    }

    private void saveUserRoles(User user, List<String> roleIdentifiers) {
        if (roleIdentifiers == null || roleIdentifiers.isEmpty()) {
            return;
        }

        for (String roleIdent : roleIdentifiers) {
            if (roleIdent == null || roleIdent.trim().isEmpty()) {
                continue;
            }
            Optional<Role> roleOpt = findRoleByIdentifier(roleIdent.trim());
            if (roleOpt.isPresent()) {
                Role role = roleOpt.get();
                if (!userRoleRepository.existsByUserIdAndRoleId(user.getId(), role.getId())) {
                    UserRole userRole = new UserRole();
                    userRole.setUser(user);
                    userRole.setRole(role);
                    userRoleRepository.save(userRole);
                }
            }
        }
    }

    private Optional<Role> findRoleByIdentifier(String identifier) {
        try {
            UUID uuid = UUID.fromString(identifier);
            Optional<Role> byId = roleRepository.findById(uuid);
            if (byId.isPresent()) {
                return byId;
            }
        } catch (IllegalArgumentException ignored) {
            // Search by roleCode
        }
        return roleRepository.findByRoleCode(identifier);
    }

    private UserDTO enrichUserDTO(User user) {
        UserDTO dto = userMapper.toDto(user);
        List<UserRole> userRoles = userRoleRepository.findByUserId(user.getId());
        List<String> roleCodes = userRoles.stream()
                .map(ur -> ur.getRole().getRoleCode())
                .collect(Collectors.toList());
        dto.setAssignedRoles(roleCodes);
        if (!roleCodes.isEmpty()) {
            dto.setDefaultRole(roleCodes.get(0));
        }
        return dto;
    }
}
