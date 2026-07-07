import axios, { AxiosError } from "axios";
import type {
  AuthResponse,
  DashboardSummary,
  MemberSubmissionStatus,
  Project,
  TrendPoint,
  UserSummary,
  WeeklyReport,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL: BASE_URL,
});

const TOKEN_KEY = "wr_token";

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function saveToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

// ---- Auth ----
export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string, role: "TEAM_MEMBER" | "MANAGER") =>
    api.post<AuthResponse>("/auth/register", { name, email, password, role }).then((r) => r.data),
};

// ---- Reports ----
export const reportApi = {
  getMine: () => api.get<WeeklyReport[]>("/reports/mine").then((r) => r.data),
  create: (payload: Partial<WeeklyReport> & { projectId: number }) =>
    api.post<WeeklyReport>("/reports", payload).then((r) => r.data),
  update: (id: number, payload: Partial<WeeklyReport> & { projectId: number }) =>
    api.put<WeeklyReport>(`/reports/${id}`, payload).then((r) => r.data),
  submit: (id: number) => api.post<WeeklyReport>(`/reports/${id}/submit`).then((r) => r.data),
  remove: (id: number) => api.delete(`/reports/${id}`),
  search: (params: {
    userId?: number;
    projectId?: number;
    status?: string;
    from?: string;
    to?: string;
  }) => api.get<WeeklyReport[]>("/reports", { params }).then((r) => r.data),
};

// ---- Projects ----
export const projectApi = {
  getAll: () => api.get<Project[]>("/projects").then((r) => r.data),
  create: (name: string, description: string, assignedMemberIds: number[]) =>
    api.post<Project>("/projects", { name, description, assignedMemberIds }).then((r) => r.data),
  update: (id: number, name: string, description: string, assignedMemberIds: number[]) =>
    api.put<Project>(`/projects/${id}`, { name, description, assignedMemberIds }).then((r) => r.data),
  remove: (id: number) => api.delete(`/projects/${id}`),
};

// ---- Users ----
export const userApi = {
  me: () => api.get<UserSummary>("/users/me").then((r) => r.data),
  teamMembers: () => api.get<UserSummary[]>("/users/team-members").then((r) => r.data),
};

// ---- Dashboard ----
export const dashboardApi = {
  summary: (weekStartDate: string) =>
    api.get<DashboardSummary>("/dashboard/summary", { params: { weekStartDate } }).then((r) => r.data),
  submissionStatus: (weekStartDate: string) =>
    api
      .get<MemberSubmissionStatus[]>("/dashboard/submission-status", { params: { weekStartDate } })
      .then((r) => r.data),
  tasksTrend: (weeks = 8, userId?: number) =>
    api.get<TrendPoint[]>("/dashboard/tasks-trend", { params: { weeks, userId } }).then((r) => r.data),
  workloadByProject: (weekStartDate: string) =>
    api
      .get<TrendPoint[]>("/dashboard/workload-by-project", { params: { weekStartDate } })
      .then((r) => r.data),
  recentActivity: () => api.get<WeeklyReport[]>("/dashboard/recent-activity").then((r) => r.data),
};

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message || err.message || "Something went wrong";
  }
  return "Something went wrong";
}
