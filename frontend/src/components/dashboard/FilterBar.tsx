"use client";

import { Select, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { Project, UserSummary } from "@/lib/types";

export interface Filters {
  userId?: string;
  projectId?: string;
  status?: string;
  from?: string;
  to?: string;
}

interface FilterBarProps {
  members: UserSummary[];
  projects: Project[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export function FilterBar({ members, projects, filters, onChange, onReset }: FilterBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:items-end">
      <Select
        label="Team member"
        value={filters.userId ?? ""}
        onChange={(e) => onChange({ ...filters, userId: e.target.value || undefined })}
      >
        <option value="">All members</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </Select>

      <Select
        label="Project"
        value={filters.projectId ?? ""}
        onChange={(e) => onChange({ ...filters, projectId: e.target.value || undefined })}
      >
        <option value="">All projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>

      <Select
        label="Status"
        value={filters.status ?? ""}
        onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
      >
        <option value="">All statuses</option>
        <option value="SUBMITTED">Submitted</option>
        <option value="LATE">Late</option>
        <option value="DRAFT">Draft</option>
      </Select>

      <Input
        label="From"
        type="date"
        value={filters.from ?? ""}
        onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
      />

      <div className="flex items-end gap-2">
        <Input
          label="To"
          type="date"
          value={filters.to ?? ""}
          onChange={(e) => onChange({ ...filters, to: e.target.value || undefined })}
        />
        <Button variant="secondary" onClick={onReset} type="button">
          Reset
        </Button>
      </div>
    </div>
  );
}
