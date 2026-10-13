package com.thinkbuild.accounts.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findByRoleId(Long roleId);
    Optional<Permission> findByRoleIdAndModule(Long roleId, String module);
    List<Permission> findByRoleName(String roleName);
}
