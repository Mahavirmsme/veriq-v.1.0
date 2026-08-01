package com.veriq.common.context;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TenantContextFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (request instanceof HttpServletRequest httpRequest) {
            String tenantHeader = httpRequest.getHeader("X-Tenant-Id");
            if (tenantHeader != null && !tenantHeader.isBlank()) {
                try {
                    UUID tenantId = UUID.fromString(tenantHeader.trim());
                    DefaultTenantContextResolver.setCurrentOrganizationId(tenantId);
                } catch (IllegalArgumentException ignored) {
                }
            }
        }
        try {
            chain.doFilter(request, response);
        } finally {
            DefaultTenantContextResolver.clear();
        }
    }
}
