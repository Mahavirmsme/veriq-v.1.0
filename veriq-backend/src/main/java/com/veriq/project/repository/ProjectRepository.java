package com.veriq.project.repository;

import com.veriq.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    boolean existsByProjectCode(String projectCode);

    boolean existsByProjectName(String projectName);

    Optional<Project> findByProjectCode(String projectCode);

    List<Project> findByOrganizationId(UUID organizationId);

    int countByOrganizationId(UUID organizationId);
}
