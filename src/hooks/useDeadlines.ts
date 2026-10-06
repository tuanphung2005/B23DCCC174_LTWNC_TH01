import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addAssignment,
  loadAssignments,
  removeAssignment,
  setFilter,
  toggleAssignment,
} from "../features/deadlines/deadlinesSlice";
import type { Assignment, NewAssignment, StatusFilter } from "../types/assignment";
import { getDeadlineInfo } from "../utils/dateUtils";

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export type SortKey = "dueDate" | "priority";

const PRIORITY_RANK: Record<Assignment["priority"], number> = { high: 0, medium: 1, low: 2 };

export function useDeadlines() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(s => s.deadlines.items);
  const filter = useAppSelector(s => s.deadlines.filter);
  const status = useAppSelector(s => s.deadlines.status);
  const error = useAppSelector(s => s.deadlines.error);
  const now = useNow();

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    if (status === "idle") void dispatch(loadAssignments());
  }, [status, dispatch]);

  const changeFilter = useCallback((f: StatusFilter) => dispatch(setFilter(f)), [dispatch]);
  const add = useCallback((v: NewAssignment) => dispatch(addAssignment(v)), [dispatch]);
  const toggle = useCallback((id: string) => dispatch(toggleAssignment(id)), [dispatch]);
  const remove = useCallback((id: string) => dispatch(removeAssignment(id)), [dispatch]);

  const visible = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    let list = items.filter(a => {
      if (q && !`${a.subject} ${a.title}`.toLowerCase().includes(q)) return false;
      switch (filter) {
        case "completed":
          return a.completed;
        case "pending":
          return !a.completed;
        case "overdue": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return !a.completed && new Date(a.dueDate).getTime() < today.getTime();
        }
        default:
          return true;
      }
    });
    list = [...list].sort((x, y) =>
      sortKey === "dueDate"
        ? new Date(x.dueDate).getTime() - new Date(y.dueDate).getTime()
        : PRIORITY_RANK[x.priority] - PRIORITY_RANK[y.priority],
    );
    return list;
  }, [items, filter, debouncedSearch, sortKey]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let overdue = 0;
    let done = 0;
    for (const a of items) {
      if (a.completed) done++;
      else if (new Date(a.dueDate).getTime() < today.getTime()) overdue++;
    }
    return { total: items.length, done, overdue, pending: items.length - done };
  }, [items]);

  const deadlineOf = useCallback((a: Assignment) => getDeadlineInfo(a.dueDate, now), [now]);

  return {
    items: visible,
    total: items.length,
    stats,
    filter,
    status,
    error,
    loading: status === "loading" || status === "idle",
    search,
    setSearch,
    sortKey,
    setSortKey,
    changeFilter,
    add,
    toggle,
    remove,
    deadlineOf,
    reload: () => dispatch(loadAssignments()),
  };
}

export type UseDeadlinesReturn = ReturnType<typeof useDeadlines>;
