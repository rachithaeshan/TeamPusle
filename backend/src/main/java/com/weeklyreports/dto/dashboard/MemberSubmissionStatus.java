package com.weeklyreports.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MemberSubmissionStatus {
    private Long userId;
    private String userName;
    private String status; // SUBMITTED / LATE / PENDING
}
