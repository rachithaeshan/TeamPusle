import { Card, StatusBadge } from "@/components/ui/Card";
import type { WeeklyReport } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function ReportsTable({ reports }: { reports: WeeklyReport[] }) {
  return (
    <Card className="overflow-x-auto">
      <h3 className="mb-4 font-display text-base font-semibold text-ink">Team reports</h3>
      {reports.length === 0 ? (
        <p className="text-sm text-slate">No reports match these filters.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
              <th className="pb-2 pr-4 font-medium">Team member</th>
              <th className="pb-2 pr-4 font-medium">Project</th>
              <th className="pb-2 pr-4 font-medium">Week</th>
              <th className="pb-2 pr-4 font-medium">Hours</th>
              <th className="pb-2 pr-4 font-medium">Blockers</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="py-3 pr-4 font-medium text-ink">{r.userName}</td>
                <td className="py-3 pr-4 text-slate">{r.projectName}</td>
                <td className="py-3 pr-4 text-slate">{formatDateRange(r.weekStartDate, r.weekEndDate)}</td>
                <td className="py-3 pr-4 text-slate">{r.hoursWorked ?? "—"}</td>
                <td className="max-w-xs truncate py-3 pr-4 text-slate">{r.blockers || "—"}</td>
                <td className="py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
