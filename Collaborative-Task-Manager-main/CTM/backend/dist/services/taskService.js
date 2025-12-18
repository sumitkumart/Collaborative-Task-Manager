"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const mongoose_1 = require("mongoose");
const Task_1 = require("../models/Task");
const User_1 = require("../models/User");
const AuditLog_1 = require("../models/AuditLog");
const socket_1 = require("../socket/socket");
const errors_1 = require("../utils/errors");
exports.taskService = {
    async createTask(input, userId) {
        const assigneeId = await getAssigneeId(input.assignedToId);
        const task = await Task_1.TaskModel.create({
            title: input.title,
            description: input.description,
            dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
            priority: input.priority || "medium",
            status: input.status || "todo",
            creatorId: new mongoose_1.Types.ObjectId(userId),
            assignedToId: assigneeId ? new mongoose_1.Types.ObjectId(assigneeId) : undefined,
        });
        const populated = await populateTask(task);
        (0, socket_1.emitTaskEvent)("task:created", populated);
        if (assigneeId) {
            (0, socket_1.emitToUser)(assigneeId, "task:assigned", populated);
        }
        return populated;
    },
    async updateTask(taskId, input, userId) {
        const task = await Task_1.TaskModel.findById(taskId);
        if (!task)
            throw new errors_1.AppError("Task not found", 404);
        if (task.creatorId.toString() !== userId &&
            task.assignedToId?.toString() !== userId) {
            throw new errors_1.AppError("Forbidden", 403);
        }
        const assigneeId = await getAssigneeId(input.assignedToId);
        const previousStatus = task.status;
        if (input.title !== undefined)
            task.title = input.title;
        if (input.description !== undefined)
            task.description = input.description;
        if (input.priority)
            task.priority = input.priority;
        if (input.status)
            task.status = input.status;
        if (input.dueDate !== undefined) {
            task.dueDate = input.dueDate ? new Date(input.dueDate) : undefined;
        }
        if (input.assignedToId !== undefined) {
            task.assignedToId = assigneeId ? new mongoose_1.Types.ObjectId(assigneeId) : undefined;
        }
        await task.save();
        if (input.status && input.status !== previousStatus) {
            await AuditLog_1.AuditLogModel.create({
                userId: new mongoose_1.Types.ObjectId(userId),
                taskId: task._id,
                fromStatus: previousStatus,
                toStatus: task.status,
            });
        }
        const populated = await populateTask(task);
        (0, socket_1.emitTaskEvent)("task:updated", populated);
        if (assigneeId) {
            (0, socket_1.emitToUser)(assigneeId, "task:assigned", populated);
        }
        return populated;
    },
    async deleteTask(taskId, userId) {
        const task = await Task_1.TaskModel.findById(taskId);
        if (!task)
            throw new errors_1.AppError("Task not found", 404);
        if (task.creatorId.toString() !== userId &&
            task.assignedToId?.toString() !== userId) {
            throw new errors_1.AppError("Forbidden", 403);
        }
        await task.deleteOne();
        (0, socket_1.emitTaskEvent)("task:deleted", { id: taskId });
    },
    async listTasks(userId, filter, status, priority, sort) {
        const baseOr = [{ creatorId: userId }, { assignedToId: userId }];
        let query = { $or: baseOr };
        if (filter === "assigned")
            query = { assignedToId: userId };
        if (filter === "created")
            query = { creatorId: userId };
        if (filter === "overdue") {
            query = {
                $or: baseOr,
                dueDate: { $lt: new Date() },
                status: { $ne: "done" },
            };
        }
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        const sortObj = {};
        if (sort === "dueDateAsc")
            sortObj.dueDate = 1;
        if (sort === "dueDateDesc")
            sortObj.dueDate = -1;
        if (Object.keys(sortObj).length === 0)
            sortObj.createdAt = -1;
        return Task_1.TaskModel.find(query)
            .sort(sortObj)
            .populate("creatorId", "name email")
            .populate("assignedToId", "name email");
    },
};
const getAssigneeId = async (assignedToId) => {
    if (!assignedToId)
        return undefined;
    const user = await User_1.UserModel.findById(assignedToId);
    if (!user)
        throw new errors_1.AppError("Assignee not found", 404);
    return user._id.toString();
};
const populateTask = async (task) => {
    await task.populate("creatorId", "name email");
    await task.populate("assignedToId", "name email");
    return task;
};
//# sourceMappingURL=taskService.js.map