"use client";

import { useState } from "react";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { Project, WeeklyReport } from "@/lib/types";
import { getWeekEnd, toISODate } from "@/lib/utils";

export interface ReportFormValues {
  weekStartDate: string;
  weekEndDate: string;
  projectId: number;
  tasksCompleted: string;
  tasksPlannedNextWeek: string;
  blockers: string;
  hoursWorked: string;
  notes: string;
}

interface ReportFormProps {
  projects: Project[];
  initial?: WeeklyReport;
  onCancel: () => void;
  onSubmit: (values: ReportFormValues) => Promise<void>;
  submitting?: boolean;
}

export function ReportForm({ projects, initial, onCancel, onSubmit, submitting }: ReportFormProps) {
  const [weekStartDate, setWeekStartDate] = useState(initial?.weekStartDate ?? "");
  const [projectId, setProjectId] = useState(initial?.projectId ?? projects[0]?.id ?? 0);
  const [tasksCompleted, setTasksCompleted] = useState(initial?.tasksCompleted ?? "");
  const [tasksPlannedNextWeek, setTasksPlannedNextWeek] = useState(initial?.tasksPlannedNextWeek ?? "");
  const [blockers, setBlockers] = useState(initial?.blockers ?? "");
  const [hoursWorked, setHoursWorked] = useState(initial?.hoursWorked?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function handleWeekStartChange(value: string) {
    setWeekStartDate(value);
  }

  const weekEndDate = weekStartDate
    ? initial?.weekEndDate && initial.weekStartDate === weekStartDate
      ? initial.weekEndDate
      : toISODate(getWeekEnd(new Date(weekStartDate + "T00:00:00")))
    : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      weekStartDate,
      weekEndDate,
      projectId: Number(projectId),
      tasksCompleted,
      tasksPlannedNextWeek,
      blockers,
      hoursWorked,
      notes,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Week starting (Monday)"
          type="date"
          required
          value={weekStartDate}
          onChange={(e) => handleWeekStartChange(e.target.value)}
        />
        <Input label="Week ending" type="date" value={weekEndDate} disabled />
      </div>

      <Select
        label="Project / category"
        required
        value={projectId}
        onChange={(e) => setProjectId(Number(e.target.value))}
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>

      <Textarea
        label="Tasks completed"
        value={tasksCompleted}
        onChange={(e) => setTasksCompleted(e.target.value)}
        placeholder="What did you get done this week?"
      />
      <Textarea
        label="Tasks planned for next week"
        value={tasksPlannedNextWeek}
        onChange={(e) => setTasksPlannedNextWeek(e.target.value)}
        placeholder="What's next?"
      />
      <Textarea
        label="Blockers / challenges"
        value={blockers}
        onChange={(e) => setBlockers(e.target.value)}
        placeholder="Anything slowing you down?"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Hours worked (optional)"
          type="number"
          step="0.5"
          min="0"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
        />
      </div>

      <Textarea
        label="Notes or links (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save draft"}
        </Button>
      </div>
    </form>
  );
}
