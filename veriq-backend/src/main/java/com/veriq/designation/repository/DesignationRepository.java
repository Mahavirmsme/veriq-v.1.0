package com.veriq.designation.repository;

import com.veriq.designation.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, UUID> {

    List<Designation> findByOrganizationId(UUID organizationId);

    Optional<Designation> findByOrganizationIdAndCode(UUID organizationId, String code);

    boolean existsByOrganizationIdAndCode(UUID organizationId, String code);

    Optional<Designation> findByIdAndOrganizationId(UUID id, UUID organizationId);
}
