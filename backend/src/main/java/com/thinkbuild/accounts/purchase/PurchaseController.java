package com.thinkbuild.accounts.purchase;

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
@RequestMapping("/api/purchases")
@Tag(name = "Purchases", description = "Purchase orders, goods receipt notes, and purchase bills")
public class PurchaseController {

    @GetMapping
    @PreAuthorize("@perm.has('PURCHASE','VIEW')")
    @Operation(summary = "Get Purchases", description = "Lists purchase orders and bills")
    public ResponseEntity<Map<String, String>> info() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Purchase",
                "message", "This module is coming in a later stage"
        ));
    }

    @PostMapping
    @PreAuthorize("@perm.has('PURCHASE','CREATE')")
    @Operation(summary = "Create Purchase Bill", description = "Creates a new purchase bill")
    public ResponseEntity<Map<String, String>> create() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Purchase"
        ));
    }
}
