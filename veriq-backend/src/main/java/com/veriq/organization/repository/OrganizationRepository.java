package com.veriq.organization.repository;

import com.veriq.organization.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, UUID> {

    boolean existsByCode(String code);

    boolean existsByName(String name);

    Optional<Organization> findByCode(String code);
}
