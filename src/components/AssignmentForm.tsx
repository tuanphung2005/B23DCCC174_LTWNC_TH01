import { useState, type FormEvent } from "react";
import type { NewAssignment, Priority } from "../types/assignment";

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AssignmentForm({ onAdd }: { onAdd: (v: NewAssignment) => void }) {
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(todayISO());
  const [priority, setPriority] = useState<Priority>("medium");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !title.trim() || !dueDate) {
      setError("Vui lòng nhập đủ môn học, tên bài tập và hạn nộp.");
      return;
    }
    if (Number.isNaN(Date.parse(dueDate))) {
      setError("Hạn nộp không hợp lệ.");
      return;
    }
    setError(null);
    onAdd({ subject: subject.trim(), title: title.trim(), dueDate, priority });
    setSubject("");
    setTitle("");
    setDueDate(todayISO());
    setPriority("medium");
  }

  const inputCls =
    "w-full bg-slate-100 px-3 py-2 text-sm focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4">
      <h2 className="font-semibold text-slate-900">Thêm bài tập mới</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Môn học *</span>
          <input
            className={inputCls}
            placeholder="VD: Lập trình Web nâng cao"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Tên bài tập *</span>
          <input
            className={inputCls}
            placeholder="VD: Bài tập Redux Toolkit"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Hạn nộp *</span>
          <input
            type="date"
            className={inputCls}
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Độ ưu tiên</span>
          <select className={inputCls} value={priority} onChange={e => setPriority(e.target.value as Priority)}>
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="mt-3 w-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 sm:w-auto"
      >
        Thêm bài tập
      </button>
    </form>
  );
}
