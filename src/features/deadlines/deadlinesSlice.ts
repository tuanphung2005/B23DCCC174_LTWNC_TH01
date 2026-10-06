import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchAssignments } from "../../api/assignmentsApi";
import type { Assignment, NewAssignment, StatusFilter } from "../../types/assignment";

export interface DeadlinesState {
  items: Assignment[];
  filter: StatusFilter;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DeadlinesState = {
  items: [],
  filter: "all",
  status: "idle",
  error: null,
};

export const loadAssignments = createAsyncThunk("deadlines/load", async () => {
  const res = await fetchAssignments();
  return res.data;
});

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const deadlinesSlice = createSlice({
  name: "deadlines",
  initialState,
  reducers: {
    addAssignment(state, action: PayloadAction<NewAssignment>) {
      state.items.unshift({ ...action.payload, id: uid(), completed: false });
    },
    toggleAssignment(state, action: PayloadAction<string>) {
      const found = state.items.find(a => a.id === action.payload);
      if (found) found.completed = !found.completed;
    },
    removeAssignment(state, action: PayloadAction<string>) {
      state.items = state.items.filter(a => a.id !== action.payload);
    },
    setFilter(state, action: PayloadAction<StatusFilter>) {
      state.filter = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAssignments.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadAssignments.fulfilled, (state, action: PayloadAction<Assignment[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không tải được danh sách mẫu";
      });
  },
});

export const { addAssignment, toggleAssignment, removeAssignment, setFilter } = deadlinesSlice.actions;
export default deadlinesSlice.reducer;
