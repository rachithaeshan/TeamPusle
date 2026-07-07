package com.weeklyreports.repository;

import com.weeklyreports.model.ReportStatus;
import com.weeklyreports.model.WeeklyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WeeklyReportRepository extends JpaRepository<WeeklyReport, Long> {

    // Personal history for a given user, most recent week first
    List<WeeklyReport> findByUserIdOrderByWeekStartDateDesc(Long userId);

    Optional<WeeklyReport> findByUserIdAndProjectIdAndWeekStartDate(
            Long userId, Long projectId, LocalDate weekStartDate);

    List<WeeklyReport> findByWeekStartDate(LocalDate weekStartDate);

    @Query("""
            SELECT r FROM WeeklyReport r
            WHERE (:userId IS NULL OR r.user.id = :userId)
              AND (:projectId IS NULL OR r.project.id = :projectId)
              AND (:status IS NULL OR r.status = :status)
              AND (:from IS NULL OR r.weekStartDate >= :from)
              AND (:to IS NULL OR r.weekEndDate <= :to)
            ORDER BY r.weekStartDate DESC, r.user.name ASC
            """)
    List<WeeklyReport> search(
            @Param("userId") Long userId,
            @Param("projectId") Long projectId,
            @Param("status") ReportStatus status,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    List<WeeklyReport> findTop10ByOrderByUpdatedAtDesc();

    long countByWeekStartDateAndStatusIn(LocalDate weekStartDate, List<ReportStatus> statuses);

    long countByWeekStartDate(LocalDate weekStartDate);
}
