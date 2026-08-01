package com.veriq.authorization.context;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class UserContextFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (request instanceof HttpServletRequest httpRequest) {
            String userHeader = httpRequest.getHeader("X-User-Id");
            if (userHeader != null && !userHeader.isBlank()) {
                try {
                    UUID userId = UUID.fromString(userHeader.trim());
                    UserContextHolder.setCurrentUserId(userId);
                } catch (IllegalArgumentException ignored) {
                }
            }
        }
        try {
            chain.doFilter(request, response);
        } finally {
            UserContextHolder.clear();
        }
    }
}
