export interface DeadlineInfo {
  diffDays: number;
  label: string;
  overdue: boolean;
  isToday: boolean;
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function getDeadlineInfo(dueDate: string, now: Date = new Date()): DeadlineInfo {
  const due = startOfDay(new Date(dueDate));
  const today = startOfDay(now);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) {
    const y = Math.abs(diffDays);
    return { diffDays, label: `Quá hạn ${y} ngày`, overdue: true, isToday: false };
  }
  if (diffDays === 0) return { diffDays, label: "Hết hạn hôm nay", overdue: false, isToday: true };
  if (diffDays === 1) return { diffDays, label: "Còn 1 ngày (ngày mai)", overdue: false, isToday: false };
  return { diffDays, label: `Còn ${diffDays} ngày`, overdue: false, isToday: false };
}

export function sortBy<T, K extends keyof T>(arr: readonly T[], key: K, dir: 1 | -1 = 1): T[] {
  return [...arr].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === bv) return 0;
    return (av > bv ? 1 : -1) * dir;
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
