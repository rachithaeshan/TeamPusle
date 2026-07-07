package com.weeklyreports.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalReportsSubmitted;
    private long totalTeamMembers;
    private long pendingCount;
    private double complianceRatePercent; // submitted / total expected
    private long openBlockersCount;
}
