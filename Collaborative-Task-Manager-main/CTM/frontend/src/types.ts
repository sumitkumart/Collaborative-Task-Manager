export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface TaskUser {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  creatorId: string | TaskUser;
  assignedToId?: string | TaskUser | null;
  createdAt?: string;
  updatedAt?: string;
}
