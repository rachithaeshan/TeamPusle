"use client";

import { useEffect, useState } from "react";
import { RouteGuard } from "@/lib/route-guard";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ReportForm, ReportFormValues } from "@/components/reports/ReportForm";
import { ReportCard } from "@/components/reports/ReportCard";
import { projectApi, reportApi, extractErrorMessage } from "@/lib/api";
import type { Project, WeeklyReport } from "@/lib/types";

function MyReportsContent() {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WeeklyReport | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([reportApi.getMine(), projectApi.getAll()]);
      setReports(r);
      setProjects(p);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function openCreate() {
    setEditing(undefined);
    setShowForm(true);
  }

  function openEdit(report: WeeklyReport) {
    setEditing(report);
    setShowForm(true);
  }

  async function handleFormSubmit(values: ReportFormValues) {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        weekStartDate: values.weekStartDate,
        weekEndDate: values.weekEndDate,
        projectId: values.projectId,
        tasksCompleted: values.tasksCompleted,
        tasksPlannedNextWeek: values.tasksPlannedNextWeek,
        blockers: values.blockers,
        hoursWorked: values.hoursWorked ? Number(values.hoursWorked) : undefined,
        notes: values.notes,
      };
      if (editing) {
        await reportApi.update(editing.id, payload);
      } else {
        await reportApi.create(payload);
      }
      setShowForm(false);
      await loadAll();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitReport(id: number) {
    setBusy(true);
    setError(null);
    try {
      await reportApi.submit(id);
      await loadAll();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this draft report?")) return;
    setBusy(true);
    setError(null);
    try {
      await reportApi.remove(id);
      await loadAll();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">My weekly reports</h1>
            <p className="mt-1 text-sm text-slate">Your report history, most recent first.</p>
          </div>
          {!showForm && projects.length > 0 && <Button onClick={openCreate}>New report</Button>}
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <Card>
            <p className="text-sm text-slate">
              No projects have been set up yet. Ask a manager to create one before submitting your first report.
            </p>
          </Card>
        )}

        {showForm && (
          <Card className="mb-8">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">
              {editing ? "Edit report" : "New weekly report"}
            </h2>
            <ReportForm
              projects={projects}
              initial={editing}
              submitting={busy}
              onCancel={() => setShowForm(false)}
              onSubmit={handleFormSubmit}
            />
          </Card>
        )}

        {loading ? (
          <p className="text-sm text-slate">Loading your reports…</p>
        ) : reports.length === 0 && !showForm ? (
          <Card>
            <p className="text-sm text-slate">
              You haven&apos;t submitted any reports yet. Click &quot;New report&quot; to get started.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                busy={busy}
                onEdit={() => openEdit(r)}
                onSubmit={() => handleSubmitReport(r.id)}
                onDelete={() => handleDelete(r.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function MyReportsPage() {
  return (
    <RouteGuard allowedRoles={["TEAM_MEMBER", "MANAGER"]}>
      <MyReportsContent />
    </RouteGuard>
  );
}
