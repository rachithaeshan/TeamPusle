package com.weeklyreports.service;

import com.weeklyreports.dto.dashboard.DashboardSummaryResponse;
import com.weeklyreports.dto.dashboard.MemberSubmissionStatus;
import com.weeklyreports.dto.dashboard.TrendPoint;
import com.weeklyreports.model.Project;
import com.weeklyreports.model.ReportStatus;
import com.weeklyreports.model.Role;
import com.weeklyreports.model.User;
import com.weeklyreports.model.WeeklyReport;
import com.weeklyreports.repository.ProjectRepository;
import com.weeklyreports.repository.UserRepository;
import com.weeklyreports.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final WeeklyReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(LocalDate weekStartDate) {
        List<User> teamMembers = userRepository.findByRole(Role.TEAM_MEMBER);
        List<WeeklyReport> weekReports = reportRepository.findByWeekStartDate(weekStartDate);

        long submitted = weekReports.stream()
                .filter(r -> r.getStatus() == ReportStatus.SUBMITTED || r.getStatus() == ReportStatus.LATE)
                .count();

        long totalTeamMembers = teamMembers.size();
        long pending = Math.max(totalTeamMembers - submitted, 0);

        double complianceRate = totalTeamMembers == 0
                ? 0.0
                : (submitted * 100.0) / totalTeamMembers;

        long openBlockers = weekReports.stream()
                .filter(r -> r.getBlockers() != null && !r.getBlockers().isBlank())
                .count();

        return DashboardSummaryResponse.builder()
                .totalReportsSubmitted(submitted)
                .totalTeamMembers(totalTeamMembers)
                .pendingCount(pending)
                .complianceRatePercent(Math.round(complianceRate * 10.0) / 10.0)
                .openBlockersCount(openBlockers)
                .build();
    }

    @Transactional(readOnly = true)
    public List<MemberSubmissionStatus> getSubmissionStatusByMember(LocalDate weekStartDate) {
        List<User> teamMembers = userRepository.findByRole(Role.TEAM_MEMBER);
        List<WeeklyReport> weekReports = reportRepository.findByWeekStartDate(weekStartDate);

        Map<Long, WeeklyReport> reportByUser = weekReports.stream()
                .collect(Collectors.toMap(r -> r.getUser().getId(), r -> r, (a, b) -> a));

        return teamMembers.stream()
                .map(member -> {
                    WeeklyReport report = reportByUser.get(member.getId());
                    String status = report == null ? "PENDING" : report.getStatus().name();
                    return MemberSubmissionStatus.builder()
                            .userId(member.getId())
                            .userName(member.getName())
                            .status(status)
                            .build();
                })
                .sorted(Comparator.comparing(MemberSubmissionStatus::getUserName))
                .toList();
    }

    /**
     * Proxy for "tasks completed trend": counts reports with a non-blank tasksCompleted
     * entry for each of the last N weeks (team-wide, or scoped to one user if userId given).
     */
    @Transactional(readOnly = true)
    public List<TrendPoint> getTasksCompletedTrend(Long userId, int numberOfWeeks) {
        LocalDate currentWeekStart = mostRecentMonday(LocalDate.now());

        return java.util.stream.IntStream.rangeClosed(0, numberOfWeeks - 1)
                .mapToObj(currentWeekStart::minusWeeks)
                .sorted()
                .map(weekStart -> {
                    List<WeeklyReport> reports = reportRepository.findByWeekStartDate(weekStart);
                    long count = reports.stream()
                            .filter(r -> userId == null || r.getUser().getId().equals(userId))
                            .filter(r -> r.getTasksCompleted() != null && !r.getTasksCompleted().isBlank())
                            .count();
                    return TrendPoint.builder()
                            .label(weekStart.toString())
                            .value(count)
                            .build();
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TrendPoint> getWorkloadByProject(LocalDate weekStartDate) {
        List<Project> projects = projectRepository.findAll();
        List<WeeklyReport> weekReports = reportRepository.findByWeekStartDate(weekStartDate);

        Map<Long, Long> countByProjectId = weekReports.stream()
                .collect(Collectors.groupingBy(r -> r.getProject().getId(), Collectors.counting()));

        return projects.stream()
                .map(p -> TrendPoint.builder()
                        .label(p.getName())
                        .value(countByProjectId.getOrDefault(p.getId(), 0L))
                        .build())
                .toList();
    }

    private LocalDate mostRecentMonday(LocalDate date) {
        return date.minusDays(date.getDayOfWeek().getValue() - 1);
    }
}
