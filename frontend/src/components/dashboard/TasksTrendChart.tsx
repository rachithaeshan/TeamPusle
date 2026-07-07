"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/Card";
import type { TrendPoint } from "@/lib/types";
import { formatDateLabel } from "@/lib/utils";

export function TasksTrendChart({ data }: { data: TrendPoint[] }) {
  const chartData = data.map((d) => ({ ...d, label: formatDateLabel(d.label) }));

  return (
    <Card>
      <h3 className="mb-4 font-display text-base font-semibold text-ink">
        Reports with tasks completed — last {data.length} weeks
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e0d8" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5b6472" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5b6472" }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#c76b3f" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
