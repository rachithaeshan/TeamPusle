"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card } from "@/components/ui/Card";
import type { MemberSubmissionStatus } from "@/lib/types";

const COLORS: Record<string, string> = {
  SUBMITTED: "#4c6b52",
  LATE: "#c76b3f",
  PENDING: "#5b6472",
};

interface TooltipPayloadItem {
  payload: { name: string; status: string };
}

function StatusTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-md border border-line bg-white px-3 py-2 text-xs shadow-sm">
      <div className="font-medium text-ink">{item.name}</div>
      <div className="text-slate">{item.status}</div>
    </div>
  );
}

export function SubmissionStatusChart({ data }: { data: MemberSubmissionStatus[] }) {
  const chartData = data.map((d) => ({
    name: d.userName,
    value: 1,
    status: d.status,
  }));

  return (
    <Card>
      <h3 className="mb-4 font-display text-base font-semibold text-ink">
        Submission status by team member
      </h3>
      {data.length === 0 ? (
        <p className="text-sm text-slate">No team members yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" hide domain={[0, 1]} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "#14213d" }} />
            <Tooltip content={<StatusTooltip />} cursor={{ fill: "#fbfaf7" }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.status] || COLORS.PENDING} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="mt-3 flex gap-4 text-xs text-slate">
        {Object.entries(COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {status}
          </div>
        ))}
      </div>
    </Card>
  );
}
