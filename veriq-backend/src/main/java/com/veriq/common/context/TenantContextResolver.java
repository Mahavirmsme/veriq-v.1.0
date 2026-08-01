package com.veriq.common.context;

import java.util.Optional;
import java.util.UUID;

/**
 * Contract for resolving the active authenticated tenant (Organization) context.
 * Integrates with the platform Authentication & Session Management framework.
 */
public interface TenantContextResolver {

    /**
     * Resolves the current authenticated organization ID from session context.
     *
     * @return Optional containing the resolved organization UUID if authenticated, or empty.
     */
    Optional<UUID> resolveCurrentOrganizationId();
}
