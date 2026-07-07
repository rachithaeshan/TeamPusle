package com.weeklyreports.service;

import com.weeklyreports.dto.report.ReportRequest;
import com.weeklyreports.dto.report.ReportResponse;
import com.weeklyreports.exception.AccessDeniedCustomException;
import com.weeklyreports.exception.DuplicateResourceException;
import com.weeklyreports.exception.ResourceNotFoundException;
import com.weeklyreports.model.Project;
import com.weeklyreports.model.ReportStatus;
import com.weeklyreports.model.User;
import com.weeklyreports.model.WeeklyReport;
import com.weeklyreports.repository.ProjectRepository;
import com.weeklyreports.repository.WeeklyReportRepository;
import com.weeklyreports.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    // grace period after the week ends before a submission counts as "late"
    private static final int GRACE_PERIOD_DAYS = 2;

    private final WeeklyReportRepository reportRepository;
    private final ProjectRepository projectRepository;
    private final CurrentUserProvider currentUserProvider;

    @Transactional(readOnly = true)
    public List<ReportResponse> getMyReports() {
        User me = currentUserProvider.getCurrentUser();
        return reportRepository.findByUserIdOrderByWeekStartDateDesc(me.getId()).stream()
                .map(ReportResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ReportResponse createDraft(ReportRequest request) {
        User me = currentUserProvider.getCurrentUser();
        Project project = getProject(request.getProjectId());

        reportRepository.findByUserIdAndProjectIdAndWeekStartDate(
                me.getId(), project.getId(), request.getWeekStartDate()
        ).ifPresent(r -> {
            throw new DuplicateResourceException(
                    "A report for this project and week already exists. Edit it instead.");
        });

        WeeklyReport report = WeeklyReport.builder()
                .user(me)
                .project(project)
                .weekStartDate(request.getWeekStartDate())
                .weekEndDate(request.getWeekEndDate())
                .tasksCompleted(request.getTasksCompleted())
                .tasksPlannedNextWeek(request.getTasksPlannedNextWeek())
                .blockers(request.getBlockers())
                .hoursWorked(request.getHoursWorked())
                .notes(request.getNotes())
                .status(ReportStatus.DRAFT)
                .build();

        return ReportResponse.fromEntity(reportRepository.save(report));
    }

    @Transactional
    public ReportResponse update(Long reportId, ReportRequest request) {
        WeeklyReport report = getOwnedReport(reportId);

        Project project = getProject(request.getProjectId());

        report.setProject(project);
        report.setWeekStartDate(request.getWeekStartDate());
        report.setWeekEndDate(request.getWeekEndDate());
        report.setTasksCompleted(request.getTasksCompleted());
        report.setTasksPlannedNextWeek(request.getTasksPlannedNextWeek());
        report.setBlockers(request.getBlockers());
        report.setHoursWorked(request.getHoursWorked());
        report.setNotes(request.getNotes());

        return ReportResponse.fromEntity(reportRepository.save(report));
    }

    @Transactional
    public ReportResponse submit(Long reportId) {
        WeeklyReport report = getOwnedReport(reportId);

        Instant now = Instant.now();
        LocalDate submittedOnDate = now.atZone(ZoneOffset.UTC).toLocalDate();
        LocalDate deadline = report.getWeekEndDate().plusDays(GRACE_PERIOD_DAYS);

        report.setStatus(submittedOnDate.isAfter(deadline) ? ReportStatus.LATE : ReportStatus.SUBMITTED);
        report.setSubmittedAt(now);

        return ReportResponse.fromEntity(reportRepository.save(report));
    }

    @Transactional
    public void delete(Long reportId) {
        WeeklyReport report = getOwnedReport(reportId);
        reportRepository.delete(report);
    }

    // ---- Manager-facing search across the whole team ----
    @Transactional(readOnly = true)
    public List<ReportResponse> search(Long userId, Long projectId, ReportStatus status,
                                        LocalDate from, LocalDate to) {
        return reportRepository.search(userId, projectId, status, from, to).stream()
                .map(ReportResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getRecentActivity() {
        return reportRepository.findTop10ByOrderByUpdatedAtDesc().stream()
                .map(ReportResponse::fromEntity)
                .toList();
    }

    // ---- helpers ----

    private WeeklyReport getOwnedReport(Long reportId) {
        User me = currentUserProvider.getCurrentUser();
        WeeklyReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id " + reportId));

        if (!report.getUser().getId().equals(me.getId())) {
            throw new AccessDeniedCustomException("You can only manage your own reports");
        }
        return report;
    }

    private Project getProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + projectId));
    }
}
