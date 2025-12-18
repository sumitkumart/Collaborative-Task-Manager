import { z } from "zod";

const taskStatusValues = ["todo", "in_progress", "review", "done"] as const;
const taskPriorityValues = ["low", "medium", "high", "urgent"] as const;

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const taskCreateSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    dueDate: z
      .string()
      .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date")
      .optional(),
    priority: z.enum(taskPriorityValues).default("medium"),
    status: z.enum(taskStatusValues).default("todo"),
    assignedToId: z.string().min(1).optional(),
  }),
});

export const taskUpdateSchema = z.object({
  body: z
    .object({
      title: z.string().min(1).max(100).optional(),
      description: z.string().optional(),
      dueDate: z
        .string()
        .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date")
        .optional(),
      priority: z.enum(taskPriorityValues).optional(),
      status: z.enum(taskStatusValues).optional(),
      assignedToId: z.string().min(1).optional().nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "No updates provided",
    }),
  params: z.object({
    id: z.string(),
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    filter: z.enum(["assigned", "created", "overdue"]).optional(),
    status: z.enum(taskStatusValues).optional(),
    priority: z.enum(taskPriorityValues).optional(),
    sort: z.enum(["dueDateAsc", "dueDateDesc"]).optional(),
  }),
});

export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
