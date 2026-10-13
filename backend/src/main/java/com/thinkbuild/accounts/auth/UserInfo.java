package com.thinkbuild.accounts.auth;

public record UserInfo(
        Long id,
        String username,
        String fullName,
        String email,
        String role
) {
    public static UserInfo fromEntity(User user) {
        return new UserInfo(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getName() : null
        );
    }
}
