import type { Assignment } from "../types/assignment";
import { AssignmentCard } from "./AssignmentCard";

export function AssignmentList({
  items,
  onToggle,
  onRemove,
}: {
  items: Assignment[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map(a => (
        <AssignmentCard key={a.id} assignment={a}>
          <AssignmentCard.Header />
          <AssignmentCard.Meta />
          <AssignmentCard.Actions onToggle={() => onToggle(a.id)} onRemove={() => onRemove(a.id)} />
        </AssignmentCard>
      ))}
    </div>
  );
}
