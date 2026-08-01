package com.veriq.common.context;

import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Default Spring component implementation for TenantContextResolver.
 * Connects User Management with the Authentication & Session context layer.
 */
@Component
public class DefaultTenantContextResolver implements TenantContextResolver {

    private static final ThreadLocal<UUID> ACTIVE_TENANT_CONTEXT = new ThreadLocal<>();

    public static void setCurrentOrganizationId(UUID organizationId) {
        ACTIVE_TENANT_CONTEXT.set(organizationId);
    }

    public static void clear() {
        ACTIVE_TENANT_CONTEXT.remove();
    }

    @Override
    public Optional<UUID> resolveCurrentOrganizationId() {
        return Optional.ofNullable(ACTIVE_TENANT_CONTEXT.get());
    }
}
