import { useForm } from "react-hook-form";
import type { User } from "../types";

type FormState = {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "review" | "done";
  assignedToId: string;
};

type Props = {
  users: User[];
  onSubmit: (payload: {
    title: string;
    description?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "todo" | "in_progress" | "review" | "done";
    assignedToId?: string;
  }) => void;
};

export const TaskForm = ({ users, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormState>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      status: "todo",
      assignedToId: "",
    },
  });

  return (
    <form
      className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-lg backdrop-blur space-y-4 transition hover:shadow-xl animate-card"
      onSubmit={handleSubmit((values) => {
        onSubmit({
          ...values,
          assignedToId: values.assignedToId || undefined,
          description: values.description || undefined,
          dueDate: values.dueDate || undefined,
        });
        reset();
      })}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Create task
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            New task card
          </h3>
          <p className="text-sm text-slate-500">
            Add context, due date, and assign instantly.
          </p>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-slate-900 to-indigo-900 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
          disabled={isSubmitting}
          >
          {isSubmitting ? "Saving..." : "Save task"}
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-slate-700">
          Title
          <input
            required
            maxLength={100}
            {...register("title")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none"
            placeholder="Ship collaboration update"
          />
        </label>
        <label className="text-sm text-slate-700">
          Due date
          <input
            type="date"
            {...register("dueDate")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none"
          />
        </label>
      </div>
      <label className="text-sm text-slate-700">
        Description
        <textarea
          {...register("description")}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none"
          placeholder="Context, blockers, and links..."
          rows={3}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-slate-700">
          Priority
          <select
            {...register("priority")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
        <label className="text-sm text-slate-700">
          Status
          <select
            {...register("status")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none"
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="review">In review</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="text-sm text-slate-700">
          Assign to
          <select
            {...register("assignedToId")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-sky-500 focus:outline-none"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
};
