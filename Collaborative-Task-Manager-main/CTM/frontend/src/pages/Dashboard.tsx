import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "../components/Navbar";
import { TaskFilters } from "../components/TaskFilters";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { Notification } from "../components/Notification";
import { taskApi, userApi } from "../lib/api";
import { useTaskSocket } from "../hooks/useTaskSocket";
import type { Task, TaskPriority, TaskStatus } from "../types";

type Filters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: "dueDateAsc" | "dueDateDesc";
};

export const Dashboard = () => {
  const [filters, setFilters] = useState<Filters>({
    status: undefined,
    priority: undefined,
    sort: "dueDateAsc",
  });
  const [notification, setNotification] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: userApi.list,
  });

  const makeTaskQuery = (filter: "assigned" | "created" | "overdue") =>
    useQuery({
      queryKey: ["tasks", filter, filters],
      queryFn: () => taskApi.list({ filter, ...filters }),
    });

  const assigned = makeTaskQuery("assigned");
  const created = makeTaskQuery("created");
  const overdue = makeTaskQuery("overdue");

  const mutationOptions = {
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  };

  const createTask = useMutation({
    mutationFn: taskApi.create,
    ...mutationOptions,
  });

  type UpdateContext = {
    previous: { key: readonly unknown[]; data: Task[] | undefined }[];
  };

  const updateTask = useMutation<
    Task,
    unknown,
    { id: string; patch: Partial<Task> },
    UpdateContext
  >({
    mutationFn: ({ id, patch }) => taskApi.update(id, patch),
    onMutate: async ({ id, patch }) => {
      // Optimistic update for task status/priority/assignee changes.
      const keys = [
        ["tasks", "assigned", filters],
        ["tasks", "created", filters],
        ["tasks", "overdue", filters],
      ];

      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previous = keys.map((key) => ({
        key,
        data: queryClient.getQueryData<Task[]>(key),
      }));

      keys.forEach((key) => {
        queryClient.setQueryData<Task[] | undefined>(key, (tasks) =>
          tasks?.map((t) => (t._id === id ? { ...t, ...patch } : t)),
        );
      });

      return { previous };
    },
    onError: (_err, _variables, context) => {
      // Roll back optimistic updates.
      if (context?.previous) {
        context.previous.forEach(({ key, data }) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => taskApi.remove(id),
    ...mutationOptions,
  });

  useTaskSocket((task) => {
    setNotification(`You were assigned "${task.title}".`);
  });

  const allUsers = useMemo(() => usersQuery.data || [], [usersQuery.data]);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 6000);
    return () => clearTimeout(timer);
  }, [notification]);

  const stats = [
    { label: "Assigned to me", value: assigned.data?.length ?? 0 },
    { label: "Created by me", value: created.data?.length ?? 0 },
    { label: "Overdue", value: overdue.data?.length ?? 0 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 top-10 h-72 w-72 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-100 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-cyan-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-4">
        <Navbar />

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Dashboard
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Stay on top of your queue
              </h2>
              <p className="text-sm text-slate-500">
                Filter, assign, and monitor tasks with instant updates and clear ownership.
              </p>
            </div>
            <TaskFilters filters={filters} onChange={setFilters} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 shadow-sm animate-card"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <TaskForm
          users={allUsers}
          onSubmit={(payload) => createTask.mutate(payload)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TaskList
            title="Assigned to me"
            tasks={assigned.data || []}
            isLoading={assigned.isLoading}
            users={allUsers}
            onUpdate={(id, patch) => updateTask.mutate({ id, patch })}
            onDelete={(id) => deleteTask.mutate(id)}
          />
          <TaskList
            title="Created by me"
            tasks={created.data || []}
            isLoading={created.isLoading}
            users={allUsers}
            onUpdate={(id, patch) => updateTask.mutate({ id, patch })}
            onDelete={(id) => deleteTask.mutate(id)}
          />
        </div>

        <TaskList
          title="Overdue"
          tasks={overdue.data || []}
          isLoading={overdue.isLoading}
          users={allUsers}
          onUpdate={(id, patch) => updateTask.mutate({ id, patch })}
          onDelete={(id) => deleteTask.mutate(id)}
        />
      </div>
      <Notification message={notification} onClose={() => setNotification(null)} />
    </div>
  );
};
