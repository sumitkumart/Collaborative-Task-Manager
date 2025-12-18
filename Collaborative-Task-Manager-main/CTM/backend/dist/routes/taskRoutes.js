"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const schemas_1 = require("./schemas");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get("/", (0, validateRequest_1.validateRequest)(schemas_1.taskQuerySchema), taskController_1.listTasks);
router.post("/", (0, validateRequest_1.validateRequest)(schemas_1.taskCreateSchema), taskController_1.createTask);
router.put("/:id", (0, validateRequest_1.validateRequest)(schemas_1.taskUpdateSchema), taskController_1.updateTask);
router.delete("/:id", (0, validateRequest_1.validateRequest)(schemas_1.taskIdParamSchema), taskController_1.deleteTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map