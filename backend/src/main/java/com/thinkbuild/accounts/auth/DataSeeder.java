package com.thinkbuild.accounts.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private record SeedUser(String username, String password, String roleName, String fullName, String email) {}

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("Starting DataSeeder check for default users...");

        List<SeedUser> seedUsers = List.of(
                new SeedUser("admin", "Admin@123", "Admin", "System Administrator", "admin@thinkbuild.com"),
                new SeedUser("accountant1", "Accountant@123", "Accountant", "Accountant User", "accountant@thinkbuild.com"),
                new SeedUser("storekeeper1", "StoreKeeper@123", "Store Keeper", "Store Keeper User", "storekeeper@thinkbuild.com"),
                new SeedUser("sales1", "Sales@123", "Sales", "Sales User", "sales@thinkbuild.com"),
                new SeedUser("cashier1", "Cashier@123", "Cashier", "Cashier User", "cashier@thinkbuild.com"),
                new SeedUser("viewer1", "Viewer@123", "Viewer", "Viewer User", "viewer@thinkbuild.com")
        );

        for (SeedUser su : seedUsers) {
            if (userRepository.findByUsername(su.username()).isEmpty()) {
                Role role = roleRepository.findByName(su.roleName())
                        .orElseGet(() -> {
                            log.info("Role '{}' not found, creating role...", su.roleName());
                            return roleRepository.save(new Role(su.roleName()));
                        });

                User user = User.builder()
                        .username(su.username())
                        .passwordHash(passwordEncoder.encode(su.password()))
                        .fullName(su.fullName())
                        .email(su.email())
                        .role(role)
                        .active(true)
                        .failedAttempts(0)
                        .build();

                userRepository.save(user);
                log.info("Seeded user '{}' with role '{}'", su.username(), su.roleName());
            }
        }
        log.info("DataSeeder completed successfully.");
    }
}
