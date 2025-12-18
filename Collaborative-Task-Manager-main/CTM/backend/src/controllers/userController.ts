import { NextFunction, Request, Response } from "express";
import { userService } from "../services/userService";

export const listUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.listUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
};
