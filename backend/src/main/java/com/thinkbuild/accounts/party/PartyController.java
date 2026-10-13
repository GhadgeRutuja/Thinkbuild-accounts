package com.thinkbuild.accounts.party;

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
@RequestMapping("/api/parties")
@Tag(name = "Parties", description = "Customers and Suppliers master data management")
public class PartyController {

    @GetMapping
    @PreAuthorize("@perm.has('PARTY','VIEW')")
    @Operation(summary = "Get Parties", description = "Lists customers and suppliers")
    public ResponseEntity<Map<String, String>> info() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Party",
                "message", "This module is coming in a later stage"
        ));
    }

    @PostMapping
    @PreAuthorize("@perm.has('PARTY','CREATE')")
    @Operation(summary = "Create Party", description = "Creates a customer or supplier profile")
    public ResponseEntity<Map<String, String>> create() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Party"
        ));
    }
}
