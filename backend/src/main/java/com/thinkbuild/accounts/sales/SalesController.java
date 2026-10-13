package com.thinkbuild.accounts.sales;

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
@RequestMapping("/api/sales")
@Tag(name = "Sales", description = "Sales invoices, delivery notes, and debit notes")
public class SalesController {

    @GetMapping
    @PreAuthorize("@perm.has('SALES','VIEW')")
    @Operation(summary = "Get Sales Invoices", description = "Lists tax sales invoices")
    public ResponseEntity<Map<String, String>> info() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Sales",
                "message", "This module is coming in a later stage"
        ));
    }

    @PostMapping
    @PreAuthorize("@perm.has('SALES','CREATE')")
    @Operation(summary = "Create Sales Invoice", description = "Creates a new tax sales invoice")
    public ResponseEntity<Map<String, String>> create() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Sales"
        ));
    }
}
