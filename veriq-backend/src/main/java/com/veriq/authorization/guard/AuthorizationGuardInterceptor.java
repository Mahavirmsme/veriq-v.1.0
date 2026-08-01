package com.veriq.authorization.guard;

import com.veriq.authorization.annotation.RequirePermission;
import com.veriq.authorization.context.UserContextHolder;
import com.veriq.authorization.exception.ForbiddenException;
import com.veriq.authorization.service.PermissionEvaluationService;
import com.veriq.common.context.TenantContextResolver;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;
import java.util.UUID;

@Component
public class AuthorizationGuardInterceptor implements HandlerInterceptor {

    private final PermissionEvaluationService permissionEvaluationService;
    private final TenantContextResolver tenantContextResolver;

    public AuthorizationGuardInterceptor(PermissionEvaluationService permissionEvaluationService,
                                          TenantContextResolver tenantContextResolver) {
        this.permissionEvaluationService = permissionEvaluationService;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        RequirePermission annotation = handlerMethod.getMethodAnnotation(RequirePermission.class);
        if (annotation == null) {
            annotation = handlerMethod.getBeanType().getAnnotation(RequirePermission.class);
        }

        if (annotation == null) {
            return true;
        }

        UUID userId = UserContextHolder.getCurrentUserId().orElse(null);
        if (userId == null) {
            throw new ForbiddenException("UNAUTHENTICATED", "Authentication context required: missing user identifier.");
        }

        UUID organizationId = tenantContextResolver.resolveCurrentOrganizationId().orElse(null);

        String requiredPermission = annotation.value();
        if (requiredPermission != null && !requiredPermission.isBlank()) {
            boolean hasPerm = permissionEvaluationService.hasPermission(userId, organizationId, requiredPermission.trim());
            if (!hasPerm) {
                throw new ForbiddenException("ACCESS_DENIED",
                        "Access denied: Missing required permission '" + requiredPermission.trim() + "'");
            }
        }

        if (annotation.any() != null && annotation.any().length > 0) {
            boolean hasAny = permissionEvaluationService.hasAnyPermission(userId, organizationId, annotation.any());
            if (!hasAny) {
                throw new ForbiddenException("ACCESS_DENIED",
                        "Access denied: Missing any of required permissions " + Arrays.toString(annotation.any()));
            }
        }

        if (annotation.all() != null && annotation.all().length > 0) {
            boolean hasAll = permissionEvaluationService.hasAllPermissions(userId, organizationId, annotation.all());
            if (!hasAll) {
                throw new ForbiddenException("ACCESS_DENIED",
                        "Access denied: Missing all required permissions " + Arrays.toString(annotation.all()));
            }
        }

        return true;
    }
}
