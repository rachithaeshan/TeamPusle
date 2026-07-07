import clsx from "clsx";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx("rounded-md border border-line bg-white p-5", className)}>{children}</div>
  );
}

const statusStyles: Record<string, string> = {
  SUBMITTED: "bg-moss/10 text-moss border-moss/30",
  LATE: "bg-accent/10 text-accent border-accent/30",
  PENDING: "bg-slate/10 text-slate border-slate/30",
  DRAFT: "bg-line/40 text-ink border-line",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] || statusStyles.DRAFT
      )}
    >
      {status}
    </span>
  );
}
