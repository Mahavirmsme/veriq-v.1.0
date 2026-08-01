package com.veriq.authorization.guard;

import com.veriq.authorization.annotation.RequirePermission;
import com.veriq.authorization.context.UserContextHolder;
import com.veriq.authorization.exception.ForbiddenException;
import com.veriq.authorization.service.PermissionEvaluationService;
import com.veriq.common.context.TenantContextResolver;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.UUID;

@Aspect
@Component
public class AuthorizationGuardAspect {

    private final PermissionEvaluationService permissionEvaluationService;
    private final TenantContextResolver tenantContextResolver;

    public AuthorizationGuardAspect(PermissionEvaluationService permissionEvaluationService,
                                     TenantContextResolver tenantContextResolver) {
        this.permissionEvaluationService = permissionEvaluationService;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Around("@annotation(com.veriq.authorization.annotation.RequirePermission) || @within(com.veriq.authorization.annotation.RequirePermission)")
    public Object enforcePermissionGuard(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        RequirePermission annotation = method.getAnnotation(RequirePermission.class);
        if (annotation == null) {
            annotation = joinPoint.getTarget().getClass().getAnnotation(RequirePermission.class);
        }

        if (annotation == null) {
            return joinPoint.proceed();
        }

        UUID userId = UserContextHolder.getCurrentUserId().orElse(null);
        if (userId == null) {
            throw new ForbiddenException("UNAUTHENTICATED", "Authentication context required: missing user identifier.");
        }

        UUID organizationId = tenantContextResolver.resolveCurrentOrganizationId().orElse(null);

        // Single permission requirement check
        String requiredPermission = annotation.value();
        if (requiredPermission != null && !requiredPermission.isBlank()) {
            boolean hasPerm = permissionEvaluationService.hasPermission(userId, organizationId, requiredPermission.trim());
            if (!hasPerm) {
                throw new ForbiddenException("ACCESS_DENIED",
                        "Access denied: Missing required permission '" + requiredPermission.trim() + "'");
            }
        }

        // Any permissions check
        if (annotation.any() != null && annotation.any().length > 0) {
            boolean hasAny = permissionEvaluationService.hasAnyPermission(userId, organizationId, annotation.any());
            if (!hasAny) {
                throw new ForbiddenException("ACCESS_DENIED",
                        "Access denied: Missing any of required permissions " + Arrays.toString(annotation.any()));
            }
        }

        // All permissions check
        if (annotation.all() != null && annotation.all().length > 0) {
            boolean hasAll = permissionEvaluationService.hasAllPermissions(userId, organizationId, annotation.all());
            if (!hasAll) {
                throw new ForbiddenException("ACCESS_DENIED",
                        "Access denied: Missing all required permissions " + Arrays.toString(annotation.all()));
            }
        }

        return joinPoint.proceed();
    }
}
