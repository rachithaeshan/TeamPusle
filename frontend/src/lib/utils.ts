// Returns the Monday of the week containing `date` (ISO week, Mon-Sun)
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6);
  return d;
}

export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDateLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDateRange(startIso: string, endIso: string): string {
  return `${formatDateLabel(startIso)} – ${formatDateLabel(endIso)}`;
}

export function shiftWeek(weekStartIso: string, deltaWeeks: number): string {
  const d = new Date(weekStartIso + "T00:00:00");
  d.setDate(d.getDate() + deltaWeeks * 7);
  return toISODate(d);
}

export function currentWeekStartIso(): string {
  return toISODate(getWeekStart(new Date()));
}
