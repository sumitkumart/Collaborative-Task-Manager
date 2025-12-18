import { Router } from "express";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  taskCreateSchema,
  taskIdParamSchema,
  taskQuerySchema,
  taskUpdateSchema,
} from "./schemas";

const router = Router();

router.use(authMiddleware);

router.get("/", validateRequest(taskQuerySchema), listTasks);
router.post("/", validateRequest(taskCreateSchema), createTask);
router.put("/:id", validateRequest(taskUpdateSchema), updateTask);
router.delete("/:id", validateRequest(taskIdParamSchema), deleteTask);

export default router;
