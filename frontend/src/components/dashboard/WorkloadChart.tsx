"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/Card";
import type { TrendPoint } from "@/lib/types";

export function WorkloadChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card>
      <h3 className="mb-4 font-display text-base font-semibold text-ink">
        Workload distribution by project (this week)
      </h3>
      {data.length === 0 ? (
        <p className="text-sm text-slate">No projects yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e0d8" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5b6472" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5b6472" }} />
            <Tooltip />
            <Bar dataKey="value" fill="#14213d" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
