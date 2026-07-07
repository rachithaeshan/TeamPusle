"use client";

import { useEffect, useState } from "react";
import { RouteGuard } from "@/lib/route-guard";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { projectApi, userApi, extractErrorMessage } from "@/lib/api";
import type { Project, UserSummary } from "@/lib/types";

function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [p, m] = await Promise.all([projectApi.getAll(), userApi.teamMembers()]);
      setProjects(p);
      setMembers(m);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSubmit(name: string, description: string, assignedMemberIds: number[]) {
    setBusy(true);
    setError(null);
    try {
      if (editing) {
        await projectApi.update(editing.id, name, description, assignedMemberIds);
      } else {
        await projectApi.create(name, description, assignedMemberIds);
      }
      setShowForm(false);
      setEditing(undefined);
      await loadAll();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project? Reports linked to it will be affected.")) return;
    setBusy(true);
    setError(null);
    try {
      await projectApi.remove(id);
      await loadAll();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Projects & categories</h1>
            <p className="mt-1 text-sm text-slate">Manage the tags team members attach to their reports.</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setShowForm(true);
              }}
            >
              New project
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        {showForm && (
          <Card className="mb-8">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">
              {editing ? "Edit project" : "New project"}
            </h2>
            <ProjectForm
              members={members}
              initial={editing}
              submitting={busy}
              onCancel={() => setShowForm(false)}
              onSubmit={handleSubmit}
            />
          </Card>
        )}

        {loading ? (
          <p className="text-sm text-slate">Loading projects…</p>
        ) : projects.length === 0 && !showForm ? (
          <Card>
            <p className="text-sm text-slate">No projects yet. Create one to get started.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <Card key={p.id} className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-semibold text-ink">{p.name}</div>
                  {p.description && <p className="mt-1 text-sm text-slate">{p.description}</p>}
                  {p.assignedMemberNames.length > 0 && (
                    <p className="mt-2 text-xs text-slate">
                      Assigned: {p.assignedMemberNames.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(p.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <RouteGuard allowedRoles={["MANAGER"]}>
      <ProjectsContent />
    </RouteGuard>
  );
}
