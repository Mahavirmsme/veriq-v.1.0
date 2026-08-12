package com.veriq.bootstrap.service;

import com.veriq.bootstrap.dto.BootstrapRequestDTO;
import com.veriq.bootstrap.dto.BootstrapStatusDTO;
import com.veriq.bootstrap.entity.PlatformBootstrapRecord;
import com.veriq.bootstrap.repository.PlatformBootstrapRepository;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.organization.entity.Organization;
import com.veriq.organization.repository.OrganizationRepository;
import com.veriq.role.entity.Role;
import com.veriq.role.repository.RoleRepository;
import com.veriq.user.entity.User;
import com.veriq.user.repository.UserRepository;
import com.veriq.userrole.entity.UserRole;
import com.veriq.userrole.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@Transactional
public class PlatformBootstrapServiceImpl implements PlatformBootstrapService {

    private final PlatformBootstrapRepository platformBootstrapRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    public PlatformBootstrapServiceImpl(PlatformBootstrapRepository platformBootstrapRepository,
                                         OrganizationRepository organizationRepository,
                                         UserRepository userRepository,
                                         RoleRepository roleRepository,
                                         UserRoleRepository userRoleRepository) {
        this.platformBootstrapRepository = platformBootstrapRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public BootstrapStatusDTO getBootstrapStatus() {
        Optional<PlatformBootstrapRecord> opt = platformBootstrapRepository.findFirstByOrderByCreatedAtAsc();
        BootstrapStatusDTO dto = new BootstrapStatusDTO();
        if (opt.isPresent()) {
            PlatformBootstrapRecord record = opt.get();
            dto.setInitialized(record.isInitialized());
            dto.setPlatformName(record.getPlatformName());
            dto.setOrganizationName(record.getOrganizationName());
            dto.setDeploymentEnvironment(record.getDeploymentEnvironment());
            dto.setAdminName(record.getAdminName());
            dto.setAdminEmail(record.getAdminEmail());
            dto.setInitializedAt(record.getInitializedAt());
        } else {
            dto.setInitialized(false);
        }
        return dto;
    }

    @Override
    public BootstrapStatusDTO initializePlatform(BootstrapRequestDTO request) {
        Optional<PlatformBootstrapRecord> existing = platformBootstrapRepository.findFirstByOrderByCreatedAtAsc();
        if (existing.isPresent() && existing.get().isInitialized()) {
            throw new BusinessRuleViolationException("PLATFORM_ALREADY_INITIALIZED", "Platform initialization has already been executed.");
        }

        // 1. Create and persist Organization entity
        String orgName = request.getOrganizationName() != null ? request.getOrganizationName().trim() : "Default Organization";
        String orgCode = "ORG-" + Math.abs(orgName.hashCode() % 10000);

        Organization org = organizationRepository.findAll().stream().findFirst().orElseGet(Organization::new);
        if (org.getName() == null) {
            org.setName(orgName);
            org.setCode(orgCode);
            org.setOrganizationType("GOVERNMENT_DEPARTMENT");
            org.setStatus("ACTIVE");
            org.setContactPerson(request.getAdminName() != null ? request.getAdminName().trim() : "Administrator");
            org.setContactEmail(request.getAdminEmail() != null ? request.getAdminEmail().trim().toLowerCase() : "admin@domain.com");
            org.setContactMobile("+91-0000000000");
            org = organizationRepository.save(org);
        }

        // 2. Create and persist Administrator User entity in users table
        String adminEmail = request.getAdminEmail() != null ? request.getAdminEmail().trim().toLowerCase() : "";
        String adminName = request.getAdminName() != null ? request.getAdminName().trim() : "Admin User";
        String[] nameParts = adminName.split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        User user = userRepository.findByEmail(adminEmail).orElseGet(User::new);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(adminEmail);
        user.setPasswordHash("SHA256:" + Integer.toHexString(request.getPassword().hashCode()));
        user.setOrganizationId(org.getId());
        user.setStatus("ACTIVE");
        User savedUser = userRepository.save(user);

        // 3. Assign Default System Role (ADMIN)
        Optional<Role> adminRoleOpt = roleRepository.findByRoleCode("ADMIN");
        if (adminRoleOpt.isPresent()) {
            Role adminRole = adminRoleOpt.get();
            if (!userRoleRepository.existsByUserIdAndRoleId(savedUser.getId(), adminRole.getId())) {
                UserRole userRole = new UserRole(savedUser, adminRole);
                userRoleRepository.save(userRole);
            }
        }

        // 4. Update PlatformBootstrapRecord
        PlatformBootstrapRecord record = existing.orElseGet(PlatformBootstrapRecord::new);
        record.setInitialized(true);
        record.setPlatformName(request.getPlatformName());
        record.setOrganizationName(orgName);
        record.setDeploymentEnvironment(request.getDeploymentEnvironment() != null ? request.getDeploymentEnvironment() : "Production");
        record.setAdminName(adminName);
        record.setAdminEmail(adminEmail);
        record.setAdminPasswordHash(savedUser.getPasswordHash());
        record.setInitializedAt(OffsetDateTime.now());

        PlatformBootstrapRecord saved = platformBootstrapRepository.save(record);

        BootstrapStatusDTO dto = new BootstrapStatusDTO();
        dto.setInitialized(saved.isInitialized());
        dto.setPlatformName(saved.getPlatformName());
        dto.setOrganizationName(saved.getOrganizationName());
        dto.setDeploymentEnvironment(saved.getDeploymentEnvironment());
        dto.setAdminName(saved.getAdminName());
        dto.setAdminEmail(saved.getAdminEmail());
        dto.setInitializedAt(saved.getInitializedAt());

        return dto;
    }
}
