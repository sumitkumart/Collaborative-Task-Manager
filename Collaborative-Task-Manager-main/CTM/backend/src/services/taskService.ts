import { Types } from "mongoose";
import { TaskModel, TaskPriority, TaskStatus } from "../models/Task";
import { UserModel } from "../models/User";
import { AuditLogModel } from "../models/AuditLog";
import { emitTaskEvent, emitToUser } from "../socket/socket";
import { AppError } from "../utils/errors";

type TaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedToId?: string | null;
};

export const taskService = {
  async createTask(input: TaskInput, userId: string) {
    const assigneeId = await getAssigneeId(input.assignedToId);
    const task = await TaskModel.create({
      title: input.title,
      description: input.description,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      priority: input.priority || "medium",
      status: input.status || "todo",
      creatorId: new Types.ObjectId(userId),
      assignedToId: assigneeId ? new Types.ObjectId(assigneeId) : undefined,
    });

    const populated = await populateTask(task);

    emitTaskEvent("task:created", populated);
    if (assigneeId) {
      emitToUser(assigneeId, "task:assigned", populated);
    }

    return populated;
  },

  async updateTask(taskId: string, input: TaskInput, userId: string) {
    const task = await TaskModel.findById(taskId);
    if (!task) throw new AppError("Task not found", 404);

    if (
      task.creatorId.toString() !== userId &&
      task.assignedToId?.toString() !== userId
    ) {
      throw new AppError("Forbidden", 403);
    }

    const assigneeId = await getAssigneeId(input.assignedToId);
    const previousStatus = task.status;
    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.priority) task.priority = input.priority;
    if (input.status) task.status = input.status;
    if (input.dueDate !== undefined) {
      task.dueDate = input.dueDate ? new Date(input.dueDate) : undefined;
    }
    if (input.assignedToId !== undefined) {
      task.assignedToId = assigneeId ? new Types.ObjectId(assigneeId) : undefined;
    }

    await task.save();

    if (input.status && input.status !== previousStatus) {
      await AuditLogModel.create({
        userId: new Types.ObjectId(userId),
        taskId: task._id,
        fromStatus: previousStatus,
        toStatus: task.status,
      });
    }

    const populated = await populateTask(task);

    emitTaskEvent("task:updated", populated);
    if (assigneeId) {
      emitToUser(assigneeId, "task:assigned", populated);
    }

    return populated;
  },

  async deleteTask(taskId: string, userId: string) {
    const task = await TaskModel.findById(taskId);
    if (!task) throw new AppError("Task not found", 404);

    if (
      task.creatorId.toString() !== userId &&
      task.assignedToId?.toString() !== userId
    ) {
      throw new AppError("Forbidden", 403);
    }

    await task.deleteOne();
    emitTaskEvent("task:deleted", { id: taskId });
  },

  async listTasks(
    userId: string,
    filter?: "assigned" | "created" | "overdue",
    status?: TaskStatus,
    priority?: TaskPriority,
    sort?: "dueDateAsc" | "dueDateDesc",
  ) {
    const baseOr = [{ creatorId: userId }, { assignedToId: userId }];
    let query: Record<string, unknown> = { $or: baseOr };

    if (filter === "assigned") query = { assignedToId: userId };
    if (filter === "created") query = { creatorId: userId };
    if (filter === "overdue") {
      query = {
        $or: baseOr,
        dueDate: { $lt: new Date() },
        status: { $ne: "done" },
      };
    }
    if (status) (query as any).status = status;
    if (priority) (query as any).priority = priority;

    const sortObj: Record<string, 1 | -1> = {};
    if (sort === "dueDateAsc") sortObj.dueDate = 1;
    if (sort === "dueDateDesc") sortObj.dueDate = -1;
    if (Object.keys(sortObj).length === 0) sortObj.createdAt = -1;

    return TaskModel.find(query)
      .sort(sortObj)
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email");
  },
};

const getAssigneeId = async (assignedToId?: string | null) => {
  if (!assignedToId) return undefined;
  const user = await UserModel.findById(assignedToId);
  if (!user) throw new AppError("Assignee not found", 404);
  return user._id.toString();
};

const populateTask = async (task: any) => {
  await task.populate("creatorId", "name email");
  await task.populate("assignedToId", "name email");
  return task;
};
