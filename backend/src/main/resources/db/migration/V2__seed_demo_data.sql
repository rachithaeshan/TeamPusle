-- Seed demo users
INSERT INTO users (name, email, password, role, created_at) VALUES
('Alex Manager', 'manager@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGe7kcld6eEE8J1a', 'MANAGER', NOW()),
('Jamie Dev', 'jamie@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGe7kcld6eEE8J1a', 'TEAM_MEMBER', NOW()),
('Sam Rivera', 'sam@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGe7kcld6eEE8J1a', 'TEAM_MEMBER', NOW()),
('Taylor Chen', 'taylor@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGe7kcld6eEE8J1a', 'TEAM_MEMBER', NOW()),
('Priya Nair', 'priya@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQmGe7kcld6eEE8J1a', 'TEAM_MEMBER', NOW())
ON CONFLICT (email) DO NOTHING;

-- Seed demo projects
INSERT INTO projects (name, description, created_at) VALUES
('Client A', 'Main client engagement - website and API work', NOW()),
('Internal Tooling', 'Dashboards and automation for internal teams', NOW()),
('R&D', 'Exploratory work and prototypes', NOW()),
('Marketing', 'Marketing site and campaign support', NOW())
ON CONFLICT (name) DO NOTHING;

-- Seed sample weekly reports using explicit lookups
WITH week_base AS (
    SELECT (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))::date AS this_monday
),
jamie AS (SELECT id FROM users WHERE email = 'jamie@test.com'),
sam_u AS (SELECT id FROM users WHERE email = 'sam@test.com'),
taylor_u AS (SELECT id FROM users WHERE email = 'taylor@test.com'),
priya_u AS (SELECT id FROM users WHERE email = 'priya@test.com'),
client_a AS (SELECT id FROM projects WHERE name = 'Client A'),
internal AS (SELECT id FROM projects WHERE name = 'Internal Tooling'),
rnd AS (SELECT id FROM projects WHERE name = 'R&D'),
marketing AS (SELECT id FROM projects WHERE name = 'Marketing')
INSERT INTO weekly_reports (
    user_id, project_id, week_start_date, week_end_date,
    tasks_completed, tasks_planned_next_week, blockers, hours_worked,
    status, submitted_at, created_at, updated_at
)
SELECT jamie.id, client_a.id, (wb.this_monday - 14)::date, (wb.this_monday - 14 + 6)::date,
       'Finished login page and password reset flow', 'Start on the dashboard UI',
       'Waiting on design assets for empty states', 34.0, 'SUBMITTED', NOW(), NOW(), NOW()
FROM week_base wb, jamie, client_a
ON CONFLICT (user_id, project_id, week_start_date) DO NOTHING;

WITH week_base AS (
    SELECT (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))::date AS this_monday
),
sam_u AS (SELECT id FROM users WHERE email = 'sam@test.com'),
internal AS (SELECT id FROM projects WHERE name = 'Internal Tooling')
INSERT INTO weekly_reports (
    user_id, project_id, week_start_date, week_end_date,
    tasks_completed, tasks_planned_next_week, blockers, hours_worked,
    status, submitted_at, created_at, updated_at
)
SELECT sam_u.id, internal.id, (wb.this_monday - 14)::date, (wb.this_monday - 14 + 6)::date,
       'Set up CI pipeline for the reports service', 'Add deployment step', NULL,
       30.0, 'SUBMITTED', NOW(), NOW(), NOW()
FROM week_base wb, sam_u, internal
ON CONFLICT (user_id, project_id, week_start_date) DO NOTHING;

WITH week_base AS (
    SELECT (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))::date AS this_monday
),
taylor_u AS (SELECT id FROM users WHERE email = 'taylor@test.com'),
rnd AS (SELECT id FROM projects WHERE name = 'R&D')
INSERT INTO weekly_reports (
    user_id, project_id, week_start_date, week_end_date,
    tasks_completed, tasks_planned_next_week, blockers, hours_worked,
    status, submitted_at, created_at, updated_at
)
SELECT taylor_u.id, rnd.id, (wb.this_monday - 14)::date, (wb.this_monday - 14 + 6)::date,
       'Prototyped the new search ranking approach', 'Benchmark against current system',
       'Need more historical data to validate results', 28.0, 'SUBMITTED', NOW(), NOW(), NOW()
FROM week_base wb, taylor_u, rnd
ON CONFLICT (user_id, project_id, week_start_date) DO NOTHING;

WITH week_base AS (
    SELECT (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))::date AS this_monday
),
priya_u AS (SELECT id FROM users WHERE email = 'priya@test.com'),
marketing AS (SELECT id FROM projects WHERE name = 'Marketing')
INSERT INTO weekly_reports (
    user_id, project_id, week_start_date, week_end_date,
    tasks_completed, tasks_planned_next_week, blockers, hours_worked,
    status, submitted_at, created_at, updated_at
)
SELECT priya_u.id, marketing.id, (wb.this_monday - 14)::date, (wb.this_monday - 14 + 6)::date,
       'Drafted Q3 campaign copy', 'Get stakeholder review',
       'Blocked on brand guidelines sign-off', 22.0, 'LATE', NOW(), NOW(), NOW()
FROM week_base wb, priya_u, marketing
ON CONFLICT (user_id, project_id, week_start_date) DO NOTHING;

WITH week_base AS (
    SELECT (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))::date AS this_monday
),
jamie AS (SELECT id FROM users WHERE email = 'jamie@test.com'),
client_a AS (SELECT id FROM projects WHERE name = 'Client A')
INSERT INTO weekly_reports (
    user_id, project_id, week_start_date, week_end_date,
    tasks_completed, tasks_planned_next_week, blockers, hours_worked,
    status, submitted_at, created_at, updated_at
)
SELECT jamie.id, client_a.id, (wb.this_monday - 7)::date, (wb.this_monday - 7 + 6)::date,
       'Built the dashboard summary cards and charts', 'Wire up filters',
       'Waiting on design assets for empty states', 36.0, 'SUBMITTED', NOW(), NOW(), NOW()
FROM week_base wb, jamie, client_a
ON CONFLICT (user_id, project_id, week_start_date) DO NOTHING;

WITH week_base AS (
    SELECT (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))::date AS this_monday
),
sam_u AS (SELECT id FROM users WHERE email = 'sam@test.com'),
internal AS (SELECT id FROM projects WHERE name = 'Internal Tooling')
INSERT INTO weekly_reports (
    user_id, project_id, week_start_date, week_end_date,
    tasks_completed, tasks_planned_next_week, blockers, hours_worked,
    status, submitted_at, created_at, updated_at
)
SELECT sam_u.id, internal.id, (wb.this_monday - 7)::date, (wb.this_monday - 7 + 6)::date,
       'Finished CI pipeline, added automated tests', 'Start on deployment automation', NULL,
       32.0, 'SUBMITTED', NOW(), NOW(), NOW()
FROM week_base wb, sam_u, internal
ON CONFLICT (user_id, project_id, week_start_date) DO NOTHING;

WITH week_base AS (
    SELECT (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))::date AS this_monday
),
taylor_u AS (SELECT id FROM users WHERE email = 'taylor@test.com'),
rnd AS (SELECT id FROM projects WHERE name = 'R&D')
INSERT INTO weekly_reports (
    user_id, project_id, week_start_date, week_end_date,
    tasks_completed, tasks_planned_next_week, blockers, hours_worked,
    status, submitted_at, created_at, updated_at
)
SELECT taylor_u.id, rnd.id, (wb.this_monday - 7)::date, (wb.this_monday - 7 + 6)::date,
       'Ran benchmarks, results inconclusive', 'Try a different ranking model',
       'Need more historical data to validate results', 25.0, 'LATE', NOW(), NOW(), NOW()
FROM week_base wb, taylor_u, rnd
ON CONFLICT (user_id, project_id, week_start_date) DO NOTHING;

WITH week_base AS (
    SELECT (CURRENT_DATE - ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))::date AS this_monday
),
jamie AS (SELECT id FROM users WHERE email = 'jamie@test.com'),
client_a AS (SELECT id FROM projects WHERE name = 'Client A')
INSERT INTO weekly_reports (
    user_id, project_id, week_start_date, week_end_date,
    tasks_completed, tasks_planned_next_week, blockers, hours_worked,
    status, submitted_at, created_at, updated_at
)
SELECT jamie.id, client_a.id, wb.this_monday, wb.this_monday + 6,
       'Wired up dashboard filters and date range picker', 'Polish mobile layout', NULL,
       20.0, 'SUBMITTED', NOW(), NOW(), NOW()
FROM week_base wb, jamie, client_a
ON CONFLICT (user_id, project_id, week_start_date) DO NOTHING;
