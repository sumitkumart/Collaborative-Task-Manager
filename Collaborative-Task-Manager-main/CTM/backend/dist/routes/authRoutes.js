"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const validateRequest_1 = require("../middleware/validateRequest");
const schemas_1 = require("./schemas");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(schemas_1.registerSchema), authController_1.register);
router.post("/login", (0, validateRequest_1.validateRequest)(schemas_1.loginSchema), authController_1.login);
router.post("/logout", authMiddleware_1.authMiddleware, authController_1.logout);
router.get("/me", authMiddleware_1.authMiddleware, authController_1.me);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map