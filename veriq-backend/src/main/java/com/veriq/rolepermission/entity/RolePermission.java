package com.veriq.rolepermission.entity;

import com.veriq.permission.entity.Permission;
import com.veriq.role.entity.Role;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "role_permissions", uniqueConstraints = {
    @UniqueConstraint(name = "uq_role_permission", columnNames = {"role_id", "permission_id"})
})
public class RolePermission {

    @Id
    @Column(name = "role_permission_id")
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public RolePermission() {
        this.id = UUID.randomUUID();
    }

    public RolePermission(Role role, Permission permission) {
        this.id = UUID.randomUUID();
        this.role = role;
        this.permission = permission;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
