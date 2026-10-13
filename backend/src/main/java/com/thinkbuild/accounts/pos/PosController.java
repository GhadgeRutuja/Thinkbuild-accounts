package com.thinkbuild.accounts.pos;

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
@RequestMapping("/api/pos")
@Tag(name = "Point of Sale", description = "POS fast billing counters, registers, and receipts")
public class PosController {

    @GetMapping
    @PreAuthorize("@perm.has('POS','VIEW')")
    @Operation(summary = "Get POS Sessions", description = "Lists active POS register sessions and receipts")
    public ResponseEntity<Map<String, String>> info() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Point of Sale",
                "message", "This module is coming in a later stage"
        ));
    }

    @PostMapping
    @PreAuthorize("@perm.has('POS','CREATE')")
    @Operation(summary = "Create POS Sale", description = "Executes a POS cashier checkout transaction")
    public ResponseEntity<Map<String, String>> create() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Point of Sale"
        ));
    }
}
