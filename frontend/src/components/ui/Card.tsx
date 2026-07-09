import clsx from "clsx";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
      <div
          className={clsx(
              "rounded-md border border-line bg-white p-5 shadow-[0_1px_2px_rgba(20,33,61,0.04)]",
              className
          )}
      >
        {children}
      </div>
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
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
              statusStyles[status] || statusStyles.DRAFT
          )}
      >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {status}
    </span>
  );
}

export function PageHeader({
                             eyebrow,
                             title,
                             subtitle,
                             action,
                           }: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {eyebrow}
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate">{subtitle}</p>}
        </div>
        {action}
      </div>
  );
}