import type { ApiResponse, Assignment } from "../types/assignment";
import { isAssignment } from "../types/assignment";

function iso(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const FALLBACK_ASSIGNMENTS: Assignment[] = [
  { id: "seed-1", subject: "Toán cao cấp", title: "Bài tập chương 3: giới hạn và đạo hàm", dueDate: iso(2), priority: "high", completed: false },
  { id: "seed-2", subject: "Vật lý đại cương", title: "Báo cáo thí nghiệm đo điện trở", dueDate: iso(-1), priority: "medium", completed: false },
  { id: "seed-3", subject: "Cơ sở dữ liệu", title: "Thiết kế ERD quản lý thư viện", dueDate: iso(5), priority: "medium", completed: false },
  { id: "seed-4", subject: "Tiếng Anh", title: "Viết essay 500 từ", dueDate: iso(-3), priority: "low", completed: true },
  { id: "seed-5", subject: "Nhập môn lập trình", title: "Bài lab mảng và chuỗi", dueDate: iso(0), priority: "high", completed: false },
];

function withDelay<T>(payload: T, ms = 600): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(payload), ms));
}

export async function fetchAssignments(): Promise<ApiResponse<Assignment[]>> {
  try {
    const res = await fetch("/api/assignments");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: unknown = await res.json();
    const raw = (json as { data?: unknown }).data ?? json;
    if (Array.isArray(raw) && raw.every(isAssignment)) {
      return { data: raw, total: raw.length, fetchedAt: new Date().toISOString() };
    }
    throw new Error("Invalid payload");
  } catch {
    const data = await withDelay(FALLBACK_ASSIGNMENTS, 600);
    return { data, total: data.length, fetchedAt: new Date().toISOString() };
  }
}
