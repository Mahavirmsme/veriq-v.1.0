package com.veriq.organization.mapper;

import com.veriq.organization.dto.CreateOrganizationRequestDTO;
import com.veriq.organization.dto.OrganizationResponseDTO;
import com.veriq.organization.entity.Organization;
import org.springframework.stereotype.Component;

@Component
public class OrganizationMapper {

    public OrganizationResponseDTO toDto(Organization entity) {
        if (entity == null) {
            return null;
        }
        OrganizationResponseDTO dto = new OrganizationResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setCode(entity.getCode());
        dto.setOrganizationType(entity.getOrganizationType());
        dto.setStatus(entity.getStatus());
        dto.setDescription(entity.getDescription());
        dto.setContactPerson(entity.getContactPerson());
        dto.setDesignation(entity.getDesignation());
        dto.setContactEmail(entity.getContactEmail());
        dto.setContactMobile(entity.getContactMobile());
        dto.setAddressLine1(entity.getAddressLine1());
        dto.setAddressLine2(entity.getAddressLine2());
        dto.setCity(entity.getCity());
        dto.setState(entity.getState());
        dto.setCountry(entity.getCountry());
        dto.setPinCode(entity.getPinCode());
        dto.setProjectCount(entity.getProjectCount());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Organization toEntity(CreateOrganizationRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        Organization entity = new Organization();
        entity.setName(trimToNull(dto.getName()));
        entity.setCode(dto.getCode() != null ? dto.getCode().toUpperCase().trim() : null);
        entity.setOrganizationType(trimToNull(dto.getOrganizationType()));
        entity.setStatus("ACTIVE");
        entity.setDescription(trimToNull(dto.getDescription()));
        entity.setContactPerson(trimToNull(dto.getContactPerson()));
        entity.setDesignation(trimToNull(dto.getDesignation()));
        entity.setContactEmail(trimToNull(dto.getContactEmail()));
        entity.setContactMobile(trimToNull(dto.getContactMobile()));
        entity.setAddressLine1(trimToNull(dto.getAddressLine1()));
        entity.setAddressLine2(trimToNull(dto.getAddressLine2()));
        entity.setCity(trimToNull(dto.getCity()));
        entity.setState(trimToNull(dto.getState()));
        entity.setCountry(trimToNull(dto.getCountry()));
        entity.setPinCode(trimToNull(dto.getPinCode()));
        entity.setProjectCount(0);
        return entity;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
