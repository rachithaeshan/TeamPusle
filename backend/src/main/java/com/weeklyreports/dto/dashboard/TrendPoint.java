package com.weeklyreports.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TrendPoint {
    private String label; // e.g. week start date, project name, or user name
    private double value;
}
