package com.veriq.designation.service;

import com.veriq.common.context.TenantContextResolver;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.designation.dto.CreateDesignationPayloadDTO;
import com.veriq.designation.dto.DesignationDTO;
import com.veriq.designation.dto.UpdateDesignationPayloadDTO;
import com.veriq.designation.entity.Designation;
import com.veriq.designation.mapper.DesignationMapper;
import com.veriq.designation.repository.DesignationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DesignationServiceImpl implements DesignationService {

    private final DesignationRepository designationRepository;
    private final DesignationMapper designationMapper;
    private final TenantContextResolver tenantContextResolver;

    public DesignationServiceImpl(DesignationRepository designationRepository,
                                  DesignationMapper designationMapper,
                                  TenantContextResolver tenantContextResolver) {
        this.designationRepository = designationRepository;
        this.designationMapper = designationMapper;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DesignationDTO> getAllDesignations() {
        UUID organizationId = requireTenantContext();
        return designationRepository.findByOrganizationId(organizationId).stream()
                .map(designationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DesignationDTO getDesignationById(UUID id) {
        UUID organizationId = requireTenantContext();
        Designation designation = designationRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", id));
        return designationMapper.toDto(designation);
    }

    @Override
    public DesignationDTO createDesignation(CreateDesignationPayloadDTO payload) {
        UUID organizationId = requireTenantContext();
        String code = payload.getCode().trim().toUpperCase();

        if (designationRepository.existsByOrganizationIdAndCode(organizationId, code)) {
            throw new BusinessRuleViolationException("DESIGNATION_CODE_EXISTS",
                    "A designation with code '" + code + "' already exists in this organization.");
        }

        Designation designation = designationMapper.toEntity(payload);
        designation.setOrganizationId(organizationId);

        Designation saved = designationRepository.save(designation);
        return designationMapper.toDto(saved);
    }

    @Override
    public DesignationDTO updateDesignation(UUID id, UpdateDesignationPayloadDTO payload) {
        UUID organizationId = requireTenantContext();
        Designation designation = designationRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", id));

        String newCode = payload.getCode().trim().toUpperCase();
        if (!designation.getCode().equalsIgnoreCase(newCode) &&
                designationRepository.existsByOrganizationIdAndCode(organizationId, newCode)) {
            throw new BusinessRuleViolationException("DESIGNATION_CODE_EXISTS",
                    "A designation with code '" + newCode + "' already exists in this organization.");
        }

        designation.setTitle(payload.getTitle().trim());
        designation.setCode(newCode);
        if (payload.getStatus() != null) {
            designation.setStatus(payload.getStatus());
        }

        Designation saved = designationRepository.save(designation);
        return designationMapper.toDto(saved);
    }

    @Override
    public void deleteDesignation(UUID id) {
        UUID organizationId = requireTenantContext();
        Designation designation = designationRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", id));
        designationRepository.delete(designation);
    }

    private UUID requireTenantContext() {
        return tenantContextResolver.resolveCurrentOrganizationId()
                .orElseThrow(() -> new BusinessRuleViolationException("TENANT_CONTEXT_MISSING",
                        "Operation rejected: Active organization tenant context is required."));
    }
}
