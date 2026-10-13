package com.thinkbuild.accounts.auth;

import java.util.Map;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        UserInfo user,
        Map<String, PermissionDto> permissions
) {
}
