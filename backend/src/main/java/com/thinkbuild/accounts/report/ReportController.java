package com.thinkbuild.accounts.report;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Financial Reports", description = "Balance Sheet, Profit & Loss, Trial Balance, and Tax reports")
public class ReportController {

    @GetMapping
    @PreAuthorize("@perm.has('REPORTS','VIEW')")
    @Operation(summary = "Get Financial Reports", description = "Lists available financial and audit reports")
    public ResponseEntity<Map<String, String>> info() {
        return ResponseEntity.ok(Map.of(
                "status", "not_implemented",
                "module", "Financial Reports",
                "message", "This module is coming in a later stage"
        ));
    }
}
