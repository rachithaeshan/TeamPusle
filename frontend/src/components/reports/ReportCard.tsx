"use client";

import { StatusBadge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { WeeklyReport } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

interface ReportCardProps {
  report: WeeklyReport;
  onEdit: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  busy?: boolean;
}

export function ReportCard({ report, onEdit, onSubmit, onDelete, busy }: ReportCardProps) {
  const isDraft = report.status === "DRAFT";

  return (
    <div className="rounded-md border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-slate">
            {formatDateRange(report.weekStartDate, report.weekEndDate)}
          </div>
          <div className="mt-0.5 font-display text-lg font-semibold text-ink">
            {report.projectName}
          </div>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-ink">
        {report.tasksCompleted && (
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate">Completed</div>
            <p className="mt-0.5 whitespace-pre-wrap">{report.tasksCompleted}</p>
          </div>
        )}
        {report.blockers && (
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate">Blockers</div>
            <p className="mt-0.5 whitespace-pre-wrap text-accent">{report.blockers}</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        {isDraft && (
          <>
            <Button variant="secondary" onClick={onEdit} disabled={busy}>
              Edit
            </Button>
            <Button variant="danger" onClick={onDelete} disabled={busy}>
              Delete
            </Button>
            <Button onClick={onSubmit} disabled={busy}>
              Submit
            </Button>
          </>
        )}
        {!isDraft && (
          <Button variant="secondary" onClick={onEdit} disabled={busy}>
            View / edit
          </Button>
        )}
      </div>
    </div>
  );
}
