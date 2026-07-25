package com.veriq.project.service;

import com.veriq.asset.repository.AssetRepository;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.organization.entity.Organization;
import com.veriq.organization.repository.OrganizationRepository;
import com.veriq.project.dto.CreateProjectRequestDTO;
import com.veriq.project.dto.ProjectResponseDTO;
import com.veriq.project.dto.UpdateProjectRequestDTO;
import com.veriq.project.entity.Project;
import com.veriq.project.mapper.ProjectMapper;
import com.veriq.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final OrganizationRepository organizationRepository;
    private final AssetRepository assetRepository;
    private final ProjectMapper projectMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              OrganizationRepository organizationRepository,
                              AssetRepository assetRepository,
                              ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.organizationRepository = organizationRepository;
        this.assetRepository = assetRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(p -> projectMapper.toDto(p, assetRepository.countByProjectId(p.getId())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponseDTO getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return projectMapper.toDto(project, assetRepository.countByProjectId(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getProjectsByOrganizationId(UUID organizationId) {
        if (!organizationRepository.existsById(organizationId)) {
            throw new ResourceNotFoundException("Organization", "id", organizationId);
        }
        return projectRepository.findByOrganizationId(organizationId).stream()
                .map(p -> projectMapper.toDto(p, assetRepository.countByProjectId(p.getId())))
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponseDTO createProject(CreateProjectRequestDTO requestDTO) {
        if (requestDTO == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Project payload is required.");
        }

        Organization organization = organizationRepository.findById(requestDTO.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", requestDTO.getOrganizationId()));

        String code = requestDTO.getProjectCode() != null ? requestDTO.getProjectCode().toUpperCase().trim() : "";
        String name = requestDTO.getProjectName() != null ? requestDTO.getProjectName().trim() : "";

        if (!code.isEmpty() && projectRepository.existsByProjectCode(code)) {
            throw new BusinessRuleViolationException("DUPLICATE_PROJECT_CODE",
                    "A project with code '" + code + "' already exists.");
        }
        if (!name.isEmpty() && projectRepository.existsByProjectName(name)) {
            throw new BusinessRuleViolationException("DUPLICATE_PROJECT_NAME",
                    "A project with name '" + name + "' already exists.");
        }

        Project entity = projectMapper.toEntity(requestDTO, organization);
        Project savedEntity = projectRepository.save(entity);

        // Update organization's project count
        updateOrganizationProjectCount(organization.getId());

        return projectMapper.toDto(savedEntity, 0);
    }

    @Override
    public ProjectResponseDTO updateProject(UUID id, UpdateProjectRequestDTO requestDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        Organization organization = organizationRepository.findById(requestDTO.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", requestDTO.getOrganizationId()));

        UUID oldOrgId = project.getOrganization().getId();

        project.setOrganization(organization);
        project.setProjectName(requestDTO.getProjectName() != null ? requestDTO.getProjectName().trim() : project.getProjectName());
        project.setProjectDescription(trimToNull(requestDTO.getProjectDescription()));
        project.setProjectStatus(requestDTO.getProjectStatus() != null ? requestDTO.getProjectStatus().trim() : project.getProjectStatus());

        Project updatedEntity = projectRepository.save(project);

        // Update project counts if organization changed
        if (!oldOrgId.equals(organization.getId())) {
            updateOrganizationProjectCount(oldOrgId);
            updateOrganizationProjectCount(organization.getId());
        }

        return projectMapper.toDto(updatedEntity, assetRepository.countByProjectId(id));
    }

    @Override
    public void deleteProject(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        UUID orgId = project.getOrganization().getId();
        projectRepository.delete(project);

        // Update organization project count
        updateOrganizationProjectCount(orgId);
    }

    private void updateOrganizationProjectCount(UUID organizationId) {
        organizationRepository.findById(organizationId).ifPresent(org -> {
            int count = projectRepository.countByOrganizationId(organizationId);
            org.setProjectCount(count);
            organizationRepository.save(org);
        });
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
