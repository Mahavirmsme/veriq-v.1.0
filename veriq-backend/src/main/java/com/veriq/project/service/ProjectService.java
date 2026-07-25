package com.veriq.project.service;

import com.veriq.project.dto.CreateProjectRequestDTO;
import com.veriq.project.dto.ProjectResponseDTO;
import com.veriq.project.dto.UpdateProjectRequestDTO;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    List<ProjectResponseDTO> getAllProjects();

    ProjectResponseDTO getProjectById(UUID id);

    List<ProjectResponseDTO> getProjectsByOrganizationId(UUID organizationId);

    ProjectResponseDTO createProject(CreateProjectRequestDTO requestDTO);

    ProjectResponseDTO updateProject(UUID id, UpdateProjectRequestDTO requestDTO);

    void deleteProject(UUID id);
}
