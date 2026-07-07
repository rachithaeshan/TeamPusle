"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi, clearToken, getToken, saveToken, userApi } from "./api";
import type { AuthUser, Role } from "./types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    userApi
      .me()
      .then((me) => setUser({ userId: me.id, name: me.name, email: me.email, role: me.role }))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password);
    saveToken(res.token);
    setUser({ userId: res.userId, name: res.name, email: res.email, role: res.role });
    router.push(res.role === "MANAGER" ? "/dashboard" : "/my-reports");
  }

  async function register(name: string, email: string, password: string, role: Role) {
    const res = await authApi.register(name, email, password, role);
    saveToken(res.token);
    setUser({ userId: res.userId, name: res.name, email: res.email, role: res.role });
    router.push(res.role === "MANAGER" ? "/dashboard" : "/my-reports");
  }

  function logout() {
    clearToken();
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
