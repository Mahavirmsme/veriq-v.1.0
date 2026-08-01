package com.veriq.authorization.context;

import java.util.Optional;
import java.util.UUID;

public class UserContextHolder {

    private static final ThreadLocal<UUID> CURRENT_USER_ID = new ThreadLocal<>();

    public static void setCurrentUserId(UUID userId) {
        CURRENT_USER_ID.set(userId);
    }

    public static Optional<UUID> getCurrentUserId() {
        return Optional.ofNullable(CURRENT_USER_ID.get());
    }

    public static void clear() {
        CURRENT_USER_ID.remove();
    }
}
