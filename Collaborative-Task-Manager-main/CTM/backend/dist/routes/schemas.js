"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskIdParamSchema = exports.taskQuerySchema = exports.taskUpdateSchema = exports.taskCreateSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const taskStatusValues = ["todo", "in_progress", "review", "done"];
const taskPriorityValues = ["low", "medium", "high", "urgent"];
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email("Valid email is required"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Valid email is required"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
exports.taskCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).max(100),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z
            .string()
            .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date")
            .optional(),
        priority: zod_1.z.enum(taskPriorityValues).default("medium"),
        status: zod_1.z.enum(taskStatusValues).default("todo"),
        assignedToId: zod_1.z.string().min(1).optional(),
    }),
});
exports.taskUpdateSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(1).max(100).optional(),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z
            .string()
            .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date")
            .optional(),
        priority: zod_1.z.enum(taskPriorityValues).optional(),
        status: zod_1.z.enum(taskStatusValues).optional(),
        assignedToId: zod_1.z.string().min(1).optional().nullable(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "No updates provided",
    }),
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.taskQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        filter: zod_1.z.enum(["assigned", "created", "overdue"]).optional(),
        status: zod_1.z.enum(taskStatusValues).optional(),
        priority: zod_1.z.enum(taskPriorityValues).optional(),
        sort: zod_1.z.enum(["dueDateAsc", "dueDateDesc"]).optional(),
    }),
});
exports.taskIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
//# sourceMappingURL=schemas.js.map