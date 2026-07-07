package com.weeklyreports.model;

public enum ReportStatus {
    DRAFT,      // created but not submitted yet
    SUBMITTED,  // submitted on time
    LATE        // submitted after the week's deadline
}
