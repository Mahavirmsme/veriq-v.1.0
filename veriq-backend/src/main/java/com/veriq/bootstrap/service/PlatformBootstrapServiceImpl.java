package com.veriq.bootstrap.service;

import com.veriq.bootstrap.dto.BootstrapRequestDTO;
import com.veriq.bootstrap.dto.BootstrapStatusDTO;
import com.veriq.bootstrap.entity.PlatformBootstrapRecord;
import com.veriq.bootstrap.repository.PlatformBootstrapRepository;
import com.veriq.common.exception.BusinessRuleViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@Transactional
public class PlatformBootstrapServiceImpl implements PlatformBootstrapService {

    private final PlatformBootstrapRepository platformBootstrapRepository;

    public PlatformBootstrapServiceImpl(PlatformBootstrapRepository platformBootstrapRepository) {
        this.platformBootstrapRepository = platformBootstrapRepository;
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

        PlatformBootstrapRecord record = existing.orElseGet(PlatformBootstrapRecord::new);
        record.setInitialized(true);
        record.setPlatformName(request.getPlatformName());
        record.setOrganizationName(request.getOrganizationName());
        record.setDeploymentEnvironment(request.getDeploymentEnvironment() != null ? request.getDeploymentEnvironment() : "Production");
        record.setAdminName(request.getAdminName());
        record.setAdminEmail(request.getAdminEmail());
        record.setAdminPasswordHash("SHA256:" + Integer.toHexString(request.getPassword().hashCode())); // Placeholder hash
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
