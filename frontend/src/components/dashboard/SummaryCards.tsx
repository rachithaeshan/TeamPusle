import { Card } from "@/components/ui/Card";
import type { DashboardSummary } from "@/lib/types";

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const items = [
    { label: "Reports submitted", value: summary.totalReportsSubmitted },
    { label: "Team members", value: summary.totalTeamMembers },
    { label: "Pending", value: summary.pendingCount },
    { label: "Compliance rate", value: `${summary.complianceRatePercent}%` },
    { label: "Open blockers", value: summary.openBlockersCount },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="text-center">
          <div className="font-display text-3xl font-semibold text-ink">{item.value}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-slate">{item.label}</div>
        </Card>
      ))}
    </div>
  );
}
