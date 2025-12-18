import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  login as loginController,
  logout,
  me,
  register as registerController,
} from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import { loginSchema, registerSchema } from "./schemas";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerController);
router.post("/login", validateRequest(loginSchema), loginController);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, me);

export default router;
