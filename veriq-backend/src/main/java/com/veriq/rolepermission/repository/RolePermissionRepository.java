package com.veriq.rolepermission.repository;

import com.veriq.rolepermission.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, UUID> {
    List<RolePermission> findByRoleId(UUID roleId);
    List<RolePermission> findByPermissionId(UUID permissionId);
    Optional<RolePermission> findByRoleIdAndPermissionId(UUID roleId, UUID permissionId);
    boolean existsByRoleIdAndPermissionId(UUID roleId, UUID permissionId);
}
