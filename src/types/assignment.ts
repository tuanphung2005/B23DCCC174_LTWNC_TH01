export type Priority = "low" | "medium" | "high";

export type StatusFilter = "all" | "pending" | "overdue" | "completed";

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export type NewAssignment = Pick<Assignment, "subject" | "title" | "dueDate" | "priority">;

export type AssignmentPatch = Partial<Omit<Assignment, "id">>;

export type AssignmentView = Readonly<Assignment>;

export interface ApiResponse<T> {
  data: T;
  total: number;
  fetchedAt: string;
}

export type EntityId<T extends { id: unknown }> = T["id"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

const PRIORITIES: readonly Priority[] = ["low", "medium", "high"];

export function isAssignment(v: unknown): v is Assignment {
  if (!isRecord(v)) return false;
  return (
    typeof v.id === "string" &&
    typeof v.subject === "string" &&
    typeof v.title === "string" &&
    typeof v.dueDate === "string" &&
    typeof v.priority === "string" &&
    (PRIORITIES as readonly string[]).includes(v.priority) &&
    typeof v.completed === "boolean" &&
    !Number.isNaN(Date.parse(v.dueDate))
  );
}

export function filterValidAssignments(v: unknown): v is Assignment[] {
  return Array.isArray(v) && v.every(isAssignment);
}
