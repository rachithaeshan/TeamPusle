"use client";

import { useEffect, useState } from "react";
import { RouteGuard } from "@/lib/route-guard";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SubmissionStatusChart } from "@/components/dashboard/SubmissionStatusChart";
import { TasksTrendChart } from "@/components/dashboard/TasksTrendChart";
import { WorkloadChart } from "@/components/dashboard/WorkloadChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { FilterBar, Filters } from "@/components/dashboard/FilterBar";
import { ReportsTable } from "@/components/dashboard/ReportsTable";
import { dashboardApi, projectApi, reportApi, userApi, extractErrorMessage } from "@/lib/api";
import type {
  DashboardSummary,
  MemberSubmissionStatus,
  Project,
  TrendPoint,
  UserSummary,
  WeeklyReport,
} from "@/lib/types";
import { currentWeekStartIso, formatDateRange, getWeekEnd, shiftWeek, toISODate } from "@/lib/utils";

function DashboardContent() {
  const [weekStart, setWeekStart] = useState(currentWeekStartIso());
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<MemberSubmissionStatus[]>([]);
  const [tasksTrend, setTasksTrend] = useState<TrendPoint[]>([]);
  const [workload, setWorkload] = useState<TrendPoint[]>([]);
  const [activity, setActivity] = useState<WeeklyReport[]>([]);
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [filteredReports, setFilteredReports] = useState<WeeklyReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard(week: string) {
    setLoading(true);
    setError(null);
    try {
      const [s, sub, trend, wl, act, mem, proj] = await Promise.all([
        dashboardApi.summary(week),
        dashboardApi.submissionStatus(week),
        dashboardApi.tasksTrend(8),
        dashboardApi.workloadByProject(week),
        dashboardApi.recentActivity(),
        userApi.teamMembers(),
        projectApi.getAll(),
      ]);
      setSummary(s);
      setSubmissionStatus(sub);
      setTasksTrend(trend);
      setWorkload(wl);
      setActivity(act);
      setMembers(mem);
      setProjects(proj);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(weekStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  async function applyFilters(next: Filters) {
    setFilters(next);
    try {
      const results = await reportApi.search({
        userId: next.userId ? Number(next.userId) : undefined,
        projectId: next.projectId ? Number(next.projectId) : undefined,
        status: next.status,
        from: next.from,
        to: next.to,
      });
      setFilteredReports(results);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  useEffect(() => {
    applyFilters({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Team dashboard</h1>
            <p className="mt-1 text-sm text-slate">
              Week of{" "}
              {formatDateRange(
                weekStart,
                toISODate(getWeekEnd(new Date(weekStart + "T00:00:00")))
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setWeekStart(shiftWeek(weekStart, -1))}>
              ← Previous week
            </Button>
            <Button variant="secondary" onClick={() => setWeekStart(currentWeekStartIso())}>
              This week
            </Button>
            <Button variant="secondary" onClick={() => setWeekStart(shiftWeek(weekStart, 1))}>
              Next week →
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        {loading || !summary ? (
          <p className="text-sm text-slate">Loading dashboard…</p>
        ) : (
          <div className="flex flex-col gap-6">
            <SummaryCards summary={summary} />

            <div className="grid gap-6 md:grid-cols-2">
              <SubmissionStatusChart data={submissionStatus} />
              <WorkloadChart data={workload} />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <TasksTrendChart data={tasksTrend} />
              </div>
              <ActivityFeed reports={activity} />
            </div>

            <div className="flex flex-col gap-4 rounded-md border border-line bg-white p-5">
              <FilterBar
                members={members}
                projects={projects}
                filters={filters}
                onChange={applyFilters}
                onReset={() => applyFilters({})}
              />
            </div>

            <ReportsTable reports={filteredReports} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RouteGuard allowedRoles={["MANAGER"]}>
      <DashboardContent />
    </RouteGuard>
  );
}
