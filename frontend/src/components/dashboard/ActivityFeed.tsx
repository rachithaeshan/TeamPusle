import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Card";
import type { WeeklyReport } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function ActivityFeed({ reports }: { reports: WeeklyReport[] }) {
  return (
    <Card>
      <h3 className="mb-4 font-display text-base font-semibold text-ink">Recent activity</h3>
      {reports.length === 0 ? (
        <p className="text-sm text-slate">Nothing yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {reports.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <span className="font-medium text-ink">{r.userName}</span>{" "}
                <span className="text-slate">· {r.projectName}</span>
                <div className="text-xs text-slate">{formatDateRange(r.weekStartDate, r.weekEndDate)}</div>
              </div>
              <StatusBadge status={r.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
