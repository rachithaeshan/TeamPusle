# Weekly Report Generator & Team Dashboard

A full-stack app for submitting structured weekly work reports and analyzing them across a team.

- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA / Hibernate
- **Database:** PostgreSQL
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts
- **AI Chat Assistant:** not implemented (excluded per scope for this pass)

See [`ER_DIAGRAM.md`](./ER_DIAGRAM.md) for the database design.

---

## 1. Prerequisites (installing dependencies)

Install these before running anything:

| Tool | Version | Notes |
|---|---|---|
| Java (JDK) | 17+ | for the backend |
| Maven | 3.9+ | or use the included `mvnw` wrapper if you generate one |
| Node.js | 18+ | for the frontend |
| npm | 9+ | ships with Node |
| PostgreSQL | 14+ | or use the provided Docker Compose file |
| Docker (optional) | any recent | easiest way to run Postgres locally |

---

## 2. Running the database

**Option A — Docker (recommended):**

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with:
- database: `weekly_reports_db`
- user: `postgres`
- password: `postgres`

**Option B — local Postgres install:**

```bash
createdb weekly_reports_db
```

Make sure a `postgres` user/role with password `postgres` exists, or update the credentials in
`backend/src/main/resources/application.yml` (or via environment variables — see below).

Hibernate is configured with `ddl-auto: update`, so tables are created automatically the first time
the backend starts. No manual migration step is needed for local development.

---

## 3. Running the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**, with all routes under `/api`.

### Configuration

Defaults live in `application.yml` and can be overridden with environment variables:

```bash
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export JWT_SECRET=replace-with-a-long-random-string
export CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Key endpoints

| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET/POST/PUT/DELETE | `/api/reports/**` | authenticated (own reports) |
| GET | `/api/reports` (search/filter) | MANAGER |
| GET/POST/PUT/DELETE | `/api/projects/**` | list: any role; mutate: MANAGER |
| GET | `/api/dashboard/**` | MANAGER |
| GET | `/api/users/me`, `/api/users/team-members` | authenticated / MANAGER |

Role-based access is enforced both at the security-filter level (`SecurityConfig`) and per-method
(`@PreAuthorize`) in controllers.

---

## 4. Running the frontend

```bash
cd frontend
cp .env.local.example .env.local   # adjust NEXT_PUBLIC_API_BASE_URL if needed
npm install
npm run dev
```

The app starts on **http://localhost:3000**.

- Team members are redirected to `/my-reports` after login.
- Managers are redirected to `/dashboard` after login.
- Role is chosen at signup on `/register` (per the "role assignment at signup" option in the brief).

---

## 5. Project structure

```
weekly-report-app/
├── backend/
│   └── src/main/java/com/weeklyreports/
│       ├── config/        # SecurityConfig (CORS, JWT filter chain, RBAC rules)
│       ├── security/      # JWT service, auth filter, current-user helper
│       ├── model/         # JPA entities (User, Project, WeeklyReport) + enums
│       ├── repository/    # Spring Data JPA repositories
│       ├── dto/           # Request/response DTOs, grouped by feature
│       ├── service/       # Business logic
│       ├── controller/    # REST endpoints
│       └── exception/     # Custom exceptions + global handler
├── frontend/
│   └── src/
│       ├── app/           # Next.js routes: login, register, my-reports, dashboard, projects
│       ├── components/    # ui/, layout/, reports/, dashboard/, projects/
│       └── lib/           # api client, auth context, route guard, types, date utils
├── docker-compose.yml
└── ER_DIAGRAM.md
```

## 6. Design decisions worth knowing for the presentation

- **Fixed report schema:** the `ReportRequest` DTO and `WeeklyReport` entity intentionally expose the
  same fields to every user, in the same order — no dynamic fields — so reports stay comparable
  across the team dashboard, per the brief.
- **Submission status:** a report is `DRAFT` until submitted, then becomes `SUBMITTED` or `LATE`
  depending on whether it was submitted within a 2-day grace period after `week_end_date`. Members
  with no report for the selected week show as `PENDING` on the dashboard.
- **"Tasks completed trend"** is derived from whether each week's report has a non-blank
  `tasksCompleted` field, since tasks are captured as free text rather than itemized records. A
  natural future improvement is to normalize completed tasks into their own table for a true count.
- **Uniqueness constraint** on `(user, project, week_start_date)` prevents duplicate reports for the
  same person/project/week at the database level, not just in application code.

## 7. Suggested next steps (future improvements)

- Itemized tasks (a `report_items` table) instead of free-text fields, enabling real task-level charts.
- Email/Slack reminders for pending reports as the deadline approaches.
- The optional AI Chat Assistant described in the brief (Q&A over team activity, auto-generated
  summaries) — deliberately left out of this pass.
- Refresh tokens / shorter-lived JWTs with rotation for stronger session security.
