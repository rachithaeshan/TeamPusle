"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";

function initials(name: string) {
  return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
}

const icons: Record<string, React.ReactNode> = {
  "/dashboard": (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
  ),
  "/projects": (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      </svg>
  ),
  "/my-reports": (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" />
        <path d="M14 3v6h6M9 13h6M9 17h6" />
      </svg>
  ),
};

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const links =
      user.role === "MANAGER"
          ? [
            { href: "/dashboard", label: "Dashboard" },
            { href: "/projects", label: "Projects" },
          ]
          : [{ href: "/my-reports", label: "My Reports" }];

  return (
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-8">
            <Logo size="md" />
            <nav className="flex gap-1">
              {links.map((link) => (
                  <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(
                          "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                          pathname === link.href
                              ? "bg-ink text-paper"
                              : "text-slate hover:bg-paper hover:text-ink"
                      )}
                  >
                    {icons[link.href]}
                    {link.label}
                  </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full border border-line py-1 pl-1 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                {initials(user.name)}
              </div>
              <div className="leading-tight">
                <div className="text-sm font-medium text-ink">{user.name}</div>
                <div className="text-[11px] text-slate">
                  {user.role === "MANAGER" ? "Manager" : "Team Member"}
                </div>
              </div>
            </div>
            <Button variant="secondary" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
  );
}