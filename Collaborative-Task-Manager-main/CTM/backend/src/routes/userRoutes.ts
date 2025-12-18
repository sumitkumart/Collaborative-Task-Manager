import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { listUsers } from "../controllers/userController";

const router = Router();

router.get("/", authMiddleware, listUsers);

export default router;
