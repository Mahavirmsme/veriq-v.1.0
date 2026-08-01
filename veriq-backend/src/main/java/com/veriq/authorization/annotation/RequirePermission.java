package com.veriq.authorization.annotation;

import java.lang.annotation.*;

/**
 * Annotation enforced by Authorization Guard to require specific permissions
 * prior to protected endpoint or service method execution.
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequirePermission {

    /**
     * Required permission code (e.g. "user.read", "audit.read").
     */
    String value() default "";

    /**
     * Alternative array of permission codes where possessing ANY grants access.
     */
    String[] any() default {};

    /**
     * Alternative array of permission codes where possessing ALL is required.
     */
    String[] all() default {};
}
