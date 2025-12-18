import axios from "axios";
import { API_URL } from "../config";
import type { Task, TaskPriority, TaskStatus, User } from "../types";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

type AuthResponse = { user: User };

export const authApi = {
  async register(payload: { name: string; email: string; password: string }) {
    const res = await api.post<AuthResponse>("/api/auth/register", payload);
    return res.data;
  },
  async login(payload: { email: string; password: string }) {
    const res = await api.post<AuthResponse>("/api/auth/login", payload);
    return res.data;
  },
  async me() {
    const res = await api.get<AuthResponse>("/api/auth/me");
    return res.data;
  },
  async logout() {
    await api.post("/api/auth/logout");
  },
};

export const taskApi = {
  async list(params: {
    filter?: "assigned" | "created" | "overdue";
    status?: TaskStatus;
    priority?: TaskPriority;
    sort?: "dueDateAsc" | "dueDateDesc";
  }) {
    const res = await api.get<{ tasks: Task[] }>("/api/tasks", { params });
    return res.data.tasks;
  },
  async create(payload: Partial<Task>) {
    const res = await api.post<{ task: Task }>("/api/tasks", payload);
    return res.data.task;
  },
  async update(id: string, payload: Partial<Task>) {
    const res = await api.put<{ task: Task }>(`/api/tasks/${id}`, payload);
    return res.data.task;
  },
  async remove(id: string) {
    await api.delete(`/api/tasks/${id}`);
  },
};

export const userApi = {
  async list() {
    const res = await api.get<{ users: User[] }>("/api/users");
    return res.data.users;
  },
};
