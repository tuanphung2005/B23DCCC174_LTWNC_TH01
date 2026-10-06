import { createContext, useContext, type ReactNode } from "react";
import type { Assignment } from "../types/assignment";
import { formatDate, getDeadlineInfo } from "../utils/dateUtils";

const Ctx = createContext<Assignment | null>(null);

function useAssignment(): Assignment {
  const v = useContext(Ctx);
  if (!v) throw new Error("AssignmentCard.* phải nằm trong <AssignmentCard>");
  return v;
}

const PRIORITY_STYLE: Record<Assignment["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const PRIORITY_LABEL: Record<Assignment["priority"], string> = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

function Root({ assignment, children }: { assignment: Assignment; children: ReactNode }) {
  const info = getDeadlineInfo(assignment.dueDate);
  const tone = assignment.completed
    ? "bg-white opacity-75"
    : info.overdue
      ? "bg-red-50"
      : "bg-white";
  return (
    <Ctx.Provider value={assignment}>
      <article className={`${tone} p-4`}>
        {children}
      </article>
    </Ctx.Provider>
  );
}

function Header() {
  const a = useAssignment();
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{a.subject}</p>
        <h3 className={`mt-0.5 font-semibold text-slate-900 ${a.completed ? "line-through" : ""}`}>
          {a.title}
        </h3>
      </div>
      <span className={`shrink-0 px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLE[a.priority]}`}>
        {PRIORITY_LABEL[a.priority]}
      </span>
    </div>
  );
}

function Meta() {
  const a = useAssignment();
  const info = getDeadlineInfo(a.dueDate);
  const badge = a.completed
    ? "bg-slate-200 text-slate-600"
    : info.overdue
      ? "bg-red-600 text-white"
      : info.isToday
        ? "bg-orange-500 text-white"
        : "bg-sky-100 text-sky-800";
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-slate-500">Hạn: {formatDate(a.dueDate)}</span>
      <span className={`px-2.5 py-0.5 text-xs font-medium ${badge}`}>{info.label}</span>
      {a.completed && (
        <span className="bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          Đã hoàn thành
        </span>
      )}
    </div>
  );
}

function Actions({ onToggle, onRemove }: { onToggle: () => void; onRemove: () => void }) {
  const a = useAssignment();
  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={onToggle}
        className={`px-3 py-1.5 text-sm font-medium ${
          a.completed
            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        {a.completed ? "Bỏ đánh dấu" : "Đánh dấu hoàn thành"}
      </button>
      <button
        onClick={onRemove}
        className="bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Xoá
      </button>
    </div>
  );
}

export const AssignmentCard = Object.assign(Root, { Header, Meta, Actions });
