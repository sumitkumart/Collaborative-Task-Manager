import type { TaskPriority, TaskStatus } from "../types";

type Filters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: "dueDateAsc" | "dueDateDesc";
};

export const TaskFilters = ({
  filters,
  onChange,
}: {
  filters: Filters;
    onChange: (filters: Filters) => void;
  }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filters.status ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            status: (e.target.value || undefined) as TaskStatus | undefined,
          })
        }
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
      >
        <option value="">All status</option>
        <option value="todo">To do</option>
        <option value="in_progress">In progress</option>
        <option value="review">In review</option>
        <option value="done">Done</option>
      </select>
      <select
        value={filters.priority ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            priority: (e.target.value || undefined) as TaskPriority | undefined,
          })
        }
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
      >
        <option value="">All priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
      <select
        value={filters.sort ?? "dueDateAsc"}
        onChange={(e) =>
          onChange({
            ...filters,
            sort: e.target.value as "dueDateAsc" | "dueDateDesc",
          })
        }
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
      >
        <option value="dueDateAsc">Due date asc</option>
        <option value="dueDateDesc">Due date desc</option>
      </select>
    </div>
  );
};
