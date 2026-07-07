package com.weeklyreports.controller;

import com.weeklyreports.dto.report.ReportRequest;
import com.weeklyreports.dto.report.ReportResponse;
import com.weeklyreports.model.ReportStatus;
import com.weeklyreports.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // ---- Team member: personal reports ----

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER','MANAGER')")
    public ResponseEntity<List<ReportResponse>> getMyReports() {
        return ResponseEntity.ok(reportService.getMyReports());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEAM_MEMBER','MANAGER')")
    public ResponseEntity<ReportResponse> createDraft(@Valid @RequestBody ReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.createDraft(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER','MANAGER')")
    public ResponseEntity<ReportResponse> update(@PathVariable Long id, @Valid @RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.update(id, request));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER','MANAGER')")
    public ResponseEntity<ReportResponse> submit(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.submit(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER','MANAGER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reportService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ---- Manager: team-wide search ----

    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ReportResponse>> search(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ResponseEntity.ok(reportService.search(userId, projectId, status, from, to));
    }
}
