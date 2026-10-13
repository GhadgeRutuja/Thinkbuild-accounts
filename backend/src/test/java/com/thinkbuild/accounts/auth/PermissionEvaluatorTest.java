package com.thinkbuild.accounts.auth;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PermissionEvaluatorTest {

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PermissionService permissionService;

    private User adminUser;
    private User viewerUser;

    @BeforeEach
    void setUp() {
        Role adminRole = Role.builder().id(1L).name("Admin").build();
        adminUser = User.builder()
                .id(1L)
                .username("admin")
                .role(adminRole)
                .build();

        Role viewerRole = Role.builder().id(6L).name("Viewer").build();
        viewerUser = User.builder()
                .id(6L)
                .username("viewer1")
                .role(viewerRole)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Admin user should have all permissions including COA DELETE")
    void testAdminHasAllPermissions() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(adminUser, null, adminUser.getAuthorities())
        );

        boolean hasCoaDelete = permissionService.has("COA", "DELETE");
        assertThat(hasCoaDelete).isTrue();
    }

    @Test
    @DisplayName("Viewer user should not have COA CREATE permission")
    void testViewerCannotCreateCoa() {
        Permission coaPerm = Permission.builder()
                .id(10L)
                .role(viewerUser.getRole())
                .module("COA")
                .canView(true)
                .canCreate(false)
                .canEdit(false)
                .canDelete(false)
                .canApprove(false)
                .canPrint(true)
                .build();

        when(permissionRepository.findByRoleId(6L)).thenReturn(List.of(coaPerm));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(viewerUser, null, viewerUser.getAuthorities())
        );

        boolean hasCreate = permissionService.has("COA", "CREATE");
        assertThat(hasCreate).isFalse();
    }

    @Test
    @DisplayName("Viewer user should have COA VIEW permission")
    void testViewerCanViewCoa() {
        Permission coaPerm = Permission.builder()
                .id(10L)
                .role(viewerUser.getRole())
                .module("COA")
                .canView(true)
                .canCreate(false)
                .canEdit(false)
                .canDelete(false)
                .canApprove(false)
                .canPrint(true)
                .build();

        when(permissionRepository.findByRoleId(6L)).thenReturn(List.of(coaPerm));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(viewerUser, null, viewerUser.getAuthorities())
        );

        boolean hasView = permissionService.has("COA", "VIEW");
        assertThat(hasView).isTrue();
    }
}
