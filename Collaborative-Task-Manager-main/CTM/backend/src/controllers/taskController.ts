import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { taskService } from "../services/taskService";

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const task = await taskService.createTask(req.body, req.userId);
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const task = await taskService.updateTask(req.params.id, req.body, req.userId);
    res.json({ task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    await taskService.deleteTask(req.params.id, req.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    const { filter, status, priority, sort } = req.query;
    const tasks = await taskService.listTasks(
      req.userId,
      filter as any,
      status as any,
      priority as any,
      sort as any,
    );
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};
