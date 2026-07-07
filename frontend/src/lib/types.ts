export type Role = "TEAM_MEMBER" | "MANAGER";

export type ReportStatus = "DRAFT" | "SUBMITTED" | "LATE";

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse extends AuthUser {
  token: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  assignedMemberNames: string[];
}

export interface WeeklyReport {
  id: number;
  userId: number;
  userName: string;
  projectId: number;
  projectName: string;
  weekStartDate: string; // ISO date
  weekEndDate: string;
  tasksCompleted?: string;
  tasksPlannedNextWeek?: string;
  blockers?: string;
  hoursWorked?: number;
  notes?: string;
  status: ReportStatus;
  submittedAt?: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalReportsSubmitted: number;
  totalTeamMembers: number;
  pendingCount: number;
  complianceRatePercent: number;
  openBlockersCount: number;
}

export interface MemberSubmissionStatus {
  userId: number;
  userName: string;
  status: "SUBMITTED" | "LATE" | "PENDING";
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors?: Record<string, string>;
}
