package com.thinkbuild.accounts.coa;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/coa")
@Tag(name = "Chart of Accounts", description = "Chart of Accounts module (Stage 2)")
public class CoaController {

    @GetMapping
    @PreAuthorize("@perm.has('COA','VIEW')")
    @Operation(summary = "Get Chart of Accounts", description = "Retrieves accounts hierarchy")
    public ResponseEntity<Map<String, String>> info() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Chart of Accounts",
                "message", "This module is coming in a later stage"
        ));
    }

    @PostMapping
    @PreAuthorize("@perm.has('COA','CREATE')")
    @Operation(summary = "Create Account", description = "Creates a new account in Chart of Accounts")
    public ResponseEntity<Map<String, String>> create() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Chart of Accounts"
        ));
    }
}
