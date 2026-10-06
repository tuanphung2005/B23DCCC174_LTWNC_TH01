import { Provider } from "react-redux";
import { store } from "./app/store";
import { useDeadlines } from "./hooks/useDeadlines";
import { AssignmentForm } from "./components/AssignmentForm";
import { AssignmentList } from "./components/AssignmentList";
import { FilterBar } from "./components/FilterBar";
import { withLoading } from "./components/withLoading";
import "./index.css";

const AssignmentListWithLoading = withLoading(AssignmentList);

function Tracker() {
  const d = useDeadlines();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-4">
          <AssignmentForm onAdd={d.add} />
          <FilterBar
            filter={d.filter}
            onFilter={d.changeFilter}
            search={d.search}
            onSearch={d.setSearch}
            sortKey={d.sortKey}
            onSort={d.setSortKey}
            counts={{ total: d.stats.total, pending: d.stats.pending, overdue: d.stats.overdue, done: d.stats.done }}
          />
          <AssignmentListWithLoading
            loading={d.loading}
            error={d.error}
            onRetry={d.reload}
            total={d.items.length}
            items={d.items}
            onToggle={d.toggle}
            onRemove={d.remove}
          />
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Provider store={store}>
      <Tracker />
    </Provider>
  );
}

export default App;
