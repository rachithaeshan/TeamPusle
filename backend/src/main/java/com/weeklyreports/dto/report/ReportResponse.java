package com.weeklyreports.dto.report;

import com.weeklyreports.model.ReportStatus;
import com.weeklyreports.model.WeeklyReport;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class ReportResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long projectId;
    private String projectName;
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private String tasksCompleted;
    private String tasksPlannedNextWeek;
    private String blockers;
    private Double hoursWorked;
    private String notes;
    private ReportStatus status;
    private Instant submittedAt;
    private Instant updatedAt;

    public static ReportResponse fromEntity(WeeklyReport r) {
        return ReportResponse.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .userName(r.getUser().getName())
                .projectId(r.getProject().getId())
                .projectName(r.getProject().getName())
                .weekStartDate(r.getWeekStartDate())
                .weekEndDate(r.getWeekEndDate())
                .tasksCompleted(r.getTasksCompleted())
                .tasksPlannedNextWeek(r.getTasksPlannedNextWeek())
                .blockers(r.getBlockers())
                .hoursWorked(r.getHoursWorked())
                .notes(r.getNotes())
                .status(r.getStatus())
                .submittedAt(r.getSubmittedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
