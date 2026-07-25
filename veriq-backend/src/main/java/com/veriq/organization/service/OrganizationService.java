package com.veriq.organization.service;

import com.veriq.organization.dto.CreateOrganizationRequestDTO;
import com.veriq.organization.dto.OrganizationResponseDTO;
import com.veriq.organization.dto.UpdateOrganizationRequestDTO;

import java.util.List;
import java.util.UUID;

public interface OrganizationService {

    List<OrganizationResponseDTO> getAllOrganizations();

    OrganizationResponseDTO getOrganizationById(UUID id);

    OrganizationResponseDTO createOrganization(CreateOrganizationRequestDTO requestDTO);

    OrganizationResponseDTO updateOrganization(UUID id, UpdateOrganizationRequestDTO requestDTO);

    void deleteOrganization(UUID id);
}
