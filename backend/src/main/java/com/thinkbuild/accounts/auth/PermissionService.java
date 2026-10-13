package com.thinkbuild.accounts.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service("perm")
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    private final Map<Long, Map<String, PermissionDto>> rolePermissionsCache = new ConcurrentHashMap<>();

    public boolean has(String module, String action) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            return false;
        }

        Role role = null;
        Object principal = auth.getPrincipal();
        if (principal instanceof User user) {
            role = user.getRole();
        } else {
            String username = auth.getName();
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                role = user.getRole();
            }
        }

        if (role == null) {
            log.warn("No role found for current authenticated user: {}", auth.getName());
            return false;
        }

        if ("Admin".equalsIgnoreCase(role.getName())) {
            return true;
        }

        Map<String, PermissionDto> modulePermissions = getPermissionsForRoleId(role.getId(), role.getName());
        PermissionDto permission = modulePermissions.get(module.toUpperCase());
        if (permission == null) {
            return false;
        }

        return switch (action.toUpperCase()) {
            case "VIEW" -> permission.canView();
            case "CREATE" -> permission.canCreate();
            case "EDIT" -> permission.canEdit();
            case "DELETE" -> permission.canDelete();
            case "APPROVE" -> permission.canApprove();
            case "PRINT" -> permission.canPrint();
            default -> false;
        };
    }

    public Map<String, PermissionDto> getPermissionsForRole(Long roleId) {
        return getPermissionsForRoleId(roleId, null);
    }

    private Map<String, PermissionDto> getPermissionsForRoleId(Long roleId, String roleName) {
        if (roleId != null && rolePermissionsCache.containsKey(roleId)) {
            return rolePermissionsCache.get(roleId);
        }

        List<Permission> permissions;
        if (roleId != null) {
            permissions = permissionRepository.findByRoleId(roleId);
        } else if (roleName != null) {
            permissions = permissionRepository.findByRoleName(roleName);
        } else {
            return Collections.emptyMap();
        }

        Map<String, PermissionDto> map = permissions.stream()
                .collect(Collectors.toMap(
                        p -> p.getModule().toUpperCase(),
                        PermissionDto::fromEntity,
                        (existing, replacement) -> replacement
                ));

        if (roleId != null && !map.isEmpty()) {
            rolePermissionsCache.put(roleId, map);
        }
        return map;
    }

    public void evictCache(Long roleId) {
        if (roleId != null) {
            rolePermissionsCache.remove(roleId);
        } else {
            rolePermissionsCache.clear();
        }
    }
}
