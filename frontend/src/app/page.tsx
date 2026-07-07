"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else {
      router.replace(user.role === "MANAGER" ? "/dashboard" : "/my-reports");
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-paper text-slate">
      Loading…
    </div>
  );
}
