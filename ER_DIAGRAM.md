# Entity Relationship Diagram

This renders automatically on GitHub. You can also paste the code block below into
[Mermaid Live Editor](https://mermaid.live) to export an image/link for submission.

```mermaid
erDiagram
    USERS ||--o{ WEEKLY_REPORTS : "submits"
    PROJECTS ||--o{ WEEKLY_REPORTS : "categorizes"
    USERS }o--o{ PROJECTS : "assigned to (project_assignments)"

    USERS {
        bigint id PK
        varchar name
        varchar email UK
        varchar password
        varchar role "TEAM_MEMBER or MANAGER"
        timestamp created_at
    }

    PROJECTS {
        bigint id PK
        varchar name UK
        varchar description
        timestamp created_at
    }

    PROJECT_ASSIGNMENTS {
        bigint project_id FK
        bigint user_id FK
    }

    WEEKLY_REPORTS {
        bigint id PK
        bigint user_id FK
        bigint project_id FK
        date week_start_date
        date week_end_date
        text tasks_completed
        text tasks_planned_next_week
        text blockers
        double hours_worked "optional"
        text notes "optional"
        varchar status "DRAFT, SUBMITTED, LATE"
        timestamp submitted_at
        timestamp created_at
        timestamp updated_at
    }
```

## Design notes

- **users → weekly_reports** is one-to-many: each report belongs to exactly one author.
- **projects → weekly_reports** is one-to-many: each report is tagged with exactly one project/category.
- **users ↔ projects** is many-to-many through `project_assignments`, an optional join table used to
  scope which projects a team member is expected to report against.
- A **unique constraint** on `(user_id, project_id, week_start_date)` in `weekly_reports` keeps the
  schema comparable across the team: one report per person, per project, per week — no duplicates,
  no custom fields.
- `role` is stored directly on `users` rather than a separate roles table, since the assignment only
  requires two fixed roles. This keeps the schema simple; a `roles` table would be the natural next
  step if roles became more dynamic (e.g. per-project permissions).
