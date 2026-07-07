package com.weeklyreports.dto.report;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReportRequest {

    @NotNull(message = "Week start date is required")
    private LocalDate weekStartDate;

    @NotNull(message = "Week end date is required")
    private LocalDate weekEndDate;

    @NotNull(message = "Project is required")
    private Long projectId;

    private String tasksCompleted;

    private String tasksPlannedNextWeek;

    private String blockers;

    private Double hoursWorked; // optional

    private String notes; // optional
}
