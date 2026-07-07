package com.weeklyreports.controller;

import com.weeklyreports.dto.dashboard.DashboardSummaryResponse;
import com.weeklyreports.dto.dashboard.MemberSubmissionStatus;
import com.weeklyreports.dto.dashboard.TrendPoint;
import com.weeklyreports.dto.report.ReportResponse;
import com.weeklyreports.service.DashboardService;
import com.weeklyreports.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class DashboardController {

    private final DashboardService dashboardService;
    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStartDate) {
        return ResponseEntity.ok(dashboardService.getSummary(weekStartDate));
    }

    @GetMapping("/submission-status")
    public ResponseEntity<List<MemberSubmissionStatus>> getSubmissionStatus(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStartDate) {
        return ResponseEntity.ok(dashboardService.getSubmissionStatusByMember(weekStartDate));
    }

    @GetMapping("/tasks-trend")
    public ResponseEntity<List<TrendPoint>> getTasksTrend(
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "8") int weeks) {
        return ResponseEntity.ok(dashboardService.getTasksCompletedTrend(userId, weeks));
    }

    @GetMapping("/workload-by-project")
    public ResponseEntity<List<TrendPoint>> getWorkloadByProject(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStartDate) {
        return ResponseEntity.ok(dashboardService.getWorkloadByProject(weekStartDate));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<ReportResponse>> getRecentActivity() {
        return ResponseEntity.ok(reportService.getRecentActivity());
    }
}
