package com.thinkbuild.accounts.inventory;

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
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "Stock items, warehouses, and inventory adjustments")
public class InventoryController {

    @GetMapping
    @PreAuthorize("@perm.has('INVENTORY','VIEW')")
    @Operation(summary = "Get Inventory Items", description = "Lists stock items and stock levels")
    public ResponseEntity<Map<String, String>> info() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Inventory",
                "message", "This module is coming in a later stage"
        ));
    }

    @PostMapping
    @PreAuthorize("@perm.has('INVENTORY','CREATE')")
    @Operation(summary = "Create Stock Item", description = "Adds a new stock item or inventory transaction")
    public ResponseEntity<Map<String, String>> create() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Inventory"
        ));
    }
}
