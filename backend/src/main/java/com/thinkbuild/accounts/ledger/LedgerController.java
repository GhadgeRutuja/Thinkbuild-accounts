package com.thinkbuild.accounts.ledger;

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
@RequestMapping("/api/ledger")
@Tag(name = "General Ledger & Journals", description = "Journal vouchers and general ledger module")
public class LedgerController {

    @GetMapping
    @PreAuthorize("@perm.has('JOURNAL','VIEW')")
    @Operation(summary = "Get Ledger / Journals", description = "Retrieves ledger entries and journal vouchers")
    public ResponseEntity<Map<String, String>> info() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "General Ledger & Journal",
                "message", "This module is coming in a later stage"
        ));
    }

    @PostMapping
    @PreAuthorize("@perm.has('JOURNAL','CREATE')")
    @Operation(summary = "Post Journal Entry", description = "Posts a double-entry balanced journal voucher")
    public ResponseEntity<Map<String, String>> create() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "General Ledger & Journal"
        ));
    }
}
