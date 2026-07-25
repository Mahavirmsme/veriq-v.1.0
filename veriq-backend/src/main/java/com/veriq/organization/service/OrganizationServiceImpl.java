package com.veriq.organization.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.organization.dto.CreateOrganizationRequestDTO;
import com.veriq.organization.dto.OrganizationResponseDTO;
import com.veriq.organization.dto.UpdateOrganizationRequestDTO;
import com.veriq.organization.entity.Organization;
import com.veriq.organization.mapper.OrganizationMapper;
import com.veriq.organization.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationMapper organizationMapper;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository, OrganizationMapper organizationMapper) {
        this.organizationRepository = organizationRepository;
        this.organizationMapper = organizationMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrganizationResponseDTO> getAllOrganizations() {
        return organizationRepository.findAll().stream()
                .map(organizationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizationResponseDTO getOrganizationById(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", id));
        return organizationMapper.toDto(organization);
    }

    @Override
    public OrganizationResponseDTO createOrganization(CreateOrganizationRequestDTO requestDTO) {
        if (requestDTO == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Organization payload is required.");
        }

        String code = requestDTO.getCode() != null ? requestDTO.getCode().toUpperCase().trim() : "";
        String name = requestDTO.getName() != null ? requestDTO.getName().trim() : "";

        if (!code.isEmpty() && organizationRepository.existsByCode(code)) {
            throw new BusinessRuleViolationException("DUPLICATE_ORGANIZATION_CODE",
                    "An organization with code '" + code + "' already exists.");
        }
        if (!name.isEmpty() && organizationRepository.existsByName(name)) {
            throw new BusinessRuleViolationException("DUPLICATE_ORGANIZATION_NAME",
                    "An organization with name '" + name + "' already exists.");
        }

        Organization entity = organizationMapper.toEntity(requestDTO);
        Organization savedEntity = organizationRepository.save(entity);
        return organizationMapper.toDto(savedEntity);
    }

    @Override
    public OrganizationResponseDTO updateOrganization(UUID id, UpdateOrganizationRequestDTO requestDTO) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", id));

        organization.setName(requestDTO.getName() != null ? requestDTO.getName().trim() : organization.getName());
        organization.setOrganizationType(requestDTO.getOrganizationType() != null ? requestDTO.getOrganizationType().trim() : organization.getOrganizationType());
        organization.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus().trim() : organization.getStatus());
        organization.setDescription(trimToNull(requestDTO.getDescription()));
        organization.setContactPerson(requestDTO.getContactPerson() != null ? requestDTO.getContactPerson().trim() : organization.getContactPerson());
        organization.setDesignation(trimToNull(requestDTO.getDesignation()));
        organization.setContactEmail(requestDTO.getContactEmail() != null ? requestDTO.getContactEmail().trim() : organization.getContactEmail());
        organization.setContactMobile(requestDTO.getContactMobile() != null ? requestDTO.getContactMobile().trim() : organization.getContactMobile());
        organization.setAddressLine1(trimToNull(requestDTO.getAddressLine1()));
        organization.setAddressLine2(trimToNull(requestDTO.getAddressLine2()));
        organization.setCity(trimToNull(requestDTO.getCity()));
        organization.setState(trimToNull(requestDTO.getState()));
        organization.setCountry(trimToNull(requestDTO.getCountry()));
        organization.setPinCode(trimToNull(requestDTO.getPinCode()));

        Organization updatedEntity = organizationRepository.save(organization);
        return organizationMapper.toDto(updatedEntity);
    }

    @Override
    public void deleteOrganization(UUID id) {
        if (!organizationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Organization", "id", id);
        }
        organizationRepository.deleteById(id);
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
