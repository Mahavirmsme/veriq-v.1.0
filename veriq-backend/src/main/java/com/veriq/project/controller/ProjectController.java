package com.veriq.project.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.project.dto.CreateProjectRequestDTO;
import com.veriq.project.dto.ProjectResponseDTO;
import com.veriq.project.dto.UpdateProjectRequestDTO;
import com.veriq.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponseDTO>>> getAllProjects(
            @RequestParam(required = false) UUID organizationId) {
        List<ProjectResponseDTO> projects;
        if (organizationId != null) {
            projects = projectService.getProjectsByOrganizationId(organizationId);
        } else {
            projects = projectService.getAllProjects();
        }
        return ResponseEntity.ok(ApiResponse.success(projects, "Projects retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponseDTO>> getProjectById(@PathVariable UUID id) {
        ProjectResponseDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project, "Project retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponseDTO>> createProject(
            @Valid @RequestBody CreateProjectRequestDTO requestDTO) {
        ProjectResponseDTO createdProject = projectService.createProject(requestDTO);
        return new ResponseEntity<>(ApiResponse.success(createdProject, "Project created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponseDTO>> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProjectRequestDTO requestDTO) {
        ProjectResponseDTO updatedProject = projectService.updateProject(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.success(updatedProject, "Project updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Project deleted successfully"));
    }
}
