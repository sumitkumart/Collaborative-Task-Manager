import type { Task, TaskPriority, TaskStatus, User } from "../types";

type Props = {
  title: string;
  tasks: Task[];
  isLoading?: boolean;
  users: User[];
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
};

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  review: "In review",
  done: "Done",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const statusTone: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-indigo-100 text-indigo-700",
  review: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

const priorityTone: Record<TaskPriority, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-sky-50 text-sky-700",
  high: "bg-rose-50 text-rose-700",
  urgent: "bg-red-100 text-red-700",
};

export const TaskList = ({
  title,
  tasks,
  isLoading,
  users,
  onUpdate,
  onDelete,
}: Props) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-lg backdrop-blur transition hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {title}
          </p>
          <p className="text-xl font-semibold text-slate-900">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-slate-500">
          Nothing here yet. Create or assign a task to populate this list.
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <TaskCard
              key={task._id}
              task={task}
              users={users}
              onUpdate={onUpdate}
              onDelete={onDelete}
              delay={idx * 60}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TaskCard = ({
  task,
  users,
  onUpdate,
  onDelete,
  delay = 0,
}: {
  task: Task;
  users: User[];
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
  delay?: number;
}) => {
  const assignedUser =
    task.assignedToId && typeof task.assignedToId === "object"
      ? task.assignedToId
      : null;
  const creator =
    task.creatorId && typeof task.creatorId === "object" ? task.creatorId : null;
  const assignedValue =
    typeof task.assignedToId === "string"
      ? task.assignedToId
      : assignedUser?._id || "";

  return (
    <div
      className="rounded-2xl border border-slate-100 p-4 shadow-sm bg-gradient-to-br from-white to-slate-50 transition hover:-translate-y-0.5 hover:shadow-md animate-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            <p className="text-xs font-semibold text-sky-700">
              {creator ? `From ${creator.name}` : "Task"}
            </p>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-slate-600">{task.description}</p>
          )}
          {assignedUser && (
            <p className="text-xs text-slate-500">
              Assigned to {assignedUser.name}
            </p>
          )}
          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`rounded-full px-3 py-1 font-semibold ${statusTone[task.status]}`}
            >
              {statusLabels[task.status]}
            </span>
            <span
              className={`rounded-full px-3 py-1 font-semibold ${priorityTone[task.priority]}`}
            >
              {priorityLabels[task.priority]}
            </span>
            {task.dueDate && (
              <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(task._id)}
          className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:border-rose-200"
        >
          Delete
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Select
          label="Status"
          value={task.status}
          onChange={(status) => onUpdate(task._id, { status: status as any })}
          options={[
            { label: "To do", value: "todo" },
            { label: "In progress", value: "in_progress" },
            { label: "In review", value: "review" },
            { label: "Done", value: "done" },
          ]}
        />
        <Select
          label="Priority"
          value={task.priority}
          onChange={(priority) =>
            onUpdate(task._id, { priority: priority as any })
          }
          options={[
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
            { label: "Urgent", value: "urgent" },
          ]}
        />
        <Select
          label="Assign to"
          value={assignedValue}
          onChange={(id) =>
            onUpdate(task._id, { assignedToId: id || null } as any)
          }
          options={[
            { label: "Unassigned", value: "" },
            ...users.map((u) => ({ label: u.name, value: u._id })),
          ]}
        />
      </div>
    </div>
  );
};

const Select = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) => (
  <label className="flex flex-col text-sm text-slate-600">
    <span className="mb-1 font-semibold">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </label>
);
