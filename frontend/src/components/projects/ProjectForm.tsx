"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { Project, UserSummary } from "@/lib/types";

interface ProjectFormProps {
  members: UserSummary[];
  initial?: Project;
  onCancel: () => void;
  onSubmit: (name: string, description: string, assignedMemberIds: number[]) => Promise<void>;
  submitting?: boolean;
}

export function ProjectForm({ members, initial, onCancel, onSubmit, submitting }: ProjectFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [selectedIds, setSelectedIds] = useState<number[]>(
    members.filter((m) => initial?.assignedMemberNames.includes(m.name)).map((m) => m.id)
  );

  function toggle(id: number) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(name, description, selectedIds);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Project / category name" required value={name} onChange={(e) => setName(e.target.value)} />
      <Textarea
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {members.length > 0 && (
        <div>
          <div className="mb-1.5 text-sm font-medium text-ink">Assign team members (optional)</div>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(m.id)}
                  onChange={() => toggle(m.id)}
                />
                {m.name}
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save project"}
        </Button>
      </div>
    </form>
  );
}
