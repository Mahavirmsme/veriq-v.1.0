package com.veriq.project.mapper;

import com.veriq.organization.entity.Organization;
import com.veriq.project.dto.CreateProjectRequestDTO;
import com.veriq.project.dto.ProjectResponseDTO;
import com.veriq.project.entity.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectResponseDTO toDto(Project entity) {
        return toDto(entity, 0);
    }

    public ProjectResponseDTO toDto(Project entity, int assetCount) {
        if (entity == null) {
            return null;
        }
        ProjectResponseDTO dto = new ProjectResponseDTO();
        dto.setId(entity.getId());
        if (entity.getOrganization() != null) {
            dto.setOrganizationId(entity.getOrganization().getId());
            dto.setOrganizationName(entity.getOrganization().getName());
            dto.setOrganizationCode(entity.getOrganization().getCode());
        }
        dto.setProjectName(entity.getProjectName());
        dto.setProjectCode(entity.getProjectCode());
        dto.setProjectDescription(entity.getProjectDescription());
        dto.setProjectStatus(entity.getProjectStatus());
        dto.setAssetCount(assetCount);
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Project toEntity(CreateProjectRequestDTO dto, Organization organization) {
        if (dto == null) {
            return null;
        }
        Project entity = new Project();
        entity.setOrganization(organization);
        entity.setProjectName(trimToNull(dto.getProjectName()));
        entity.setProjectCode(dto.getProjectCode() != null ? dto.getProjectCode().toUpperCase().trim() : null);
        entity.setProjectDescription(trimToNull(dto.getProjectDescription()));
        entity.setProjectStatus(dto.getProjectStatus() != null ? dto.getProjectStatus().trim() : "ACTIVE");
        return entity;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
