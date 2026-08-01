package com.veriq.permission.repository;

import com.veriq.permission.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {

    Optional<Permission> findByPermissionCode(String permissionCode);

    List<Permission> findByCategory(String category);

    boolean existsByPermissionCode(String permissionCode);
}
