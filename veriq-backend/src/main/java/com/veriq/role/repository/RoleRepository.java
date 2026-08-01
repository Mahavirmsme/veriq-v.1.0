package com.veriq.role.repository;

import com.veriq.role.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByRoleCode(String roleCode);

    boolean existsByRoleCode(String roleCode);

    @Query("SELECT r FROM Role r WHERE r.systemRole = true OR r.organizationId = :organizationId")
    List<Role> findByOrganizationIdOrSystemRoleTrue(@Param("organizationId") UUID organizationId);

    @Query("SELECT r FROM Role r WHERE (r.systemRole = true OR r.organizationId = :organizationId) AND UPPER(r.roleCode) = UPPER(:roleCode)")
    Optional<Role> findByRoleCodeAndOrganizationIdOrSystemRole(@Param("roleCode") String roleCode, @Param("organizationId") UUID organizationId);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Role r WHERE (r.systemRole = true OR r.organizationId = :organizationId) AND UPPER(r.roleCode) = UPPER(:roleCode)")
    boolean existsByRoleCodeAndOrganizationIdOrSystemRole(@Param("roleCode") String roleCode, @Param("organizationId") UUID organizationId);

    @Query("SELECT r FROM Role r WHERE r.id = :id AND (r.systemRole = true OR r.organizationId = :organizationId)")
    Optional<Role> findByIdAndOrganizationIdOrSystemRole(@Param("id") UUID id, @Param("organizationId") UUID organizationId);
}
