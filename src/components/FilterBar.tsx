import type { StatusFilter } from "../types/assignment";
import type { SortKey } from "../hooks/useDeadlines";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chưa hoàn thành" },
  { value: "overdue", label: "Quá hạn" },
  { value: "completed", label: "Đã hoàn thành" },
];

interface Props {
  filter: StatusFilter;
  onFilter: (f: StatusFilter) => void;
  search: string;
  onSearch: (v: string) => void;
  sortKey: SortKey;
  onSort: (v: SortKey) => void;
  counts: { total: number; pending: number; overdue: number; done: number };
}

export function FilterBar({ filter, onFilter, search, onSearch, sortKey, onSort, counts }: Props) {
  return (
    <div className="bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => {
          const active = filter === f.value;
          const badge =
            f.value === "all"
              ? counts.total
              : f.value === "pending"
                ? counts.pending
                : f.value === "overdue"
                  ? counts.overdue
                  : counts.done;
          return (
            <button
              key={f.value}
              onClick={() => onFilter(f.value)}
              className={`px-3 py-1.5 text-sm font-medium ${
                active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f.label} ({badge})
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Tìm theo môn học / tên bài tập…"
          className="flex-1 bg-slate-100 px-3 py-2 text-sm focus:outline-none"
        />
        <select
          value={sortKey}
          onChange={e => onSort(e.target.value as SortKey)}
          className="bg-slate-100 px-3 py-2 text-sm"
          aria-label="Sắp xếp"
        >
          <option value="dueDate">Sắp xếp: Hạn gần nhất</option>
          <option value="priority">Sắp xếp: Ưu tiên cao trước</option>
        </select>
      </div>
    </div>
  );
}
