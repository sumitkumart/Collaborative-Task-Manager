"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTasks = exports.deleteTask = exports.updateTask = exports.createTask = void 0;
const taskService_1 = require("../services/taskService");
const createTask = async (req, res, next) => {
    try {
        if (!req.userId)
            return res.status(401).json({ message: "Unauthorized" });
        const task = await taskService_1.taskService.createTask(req.body, req.userId);
        res.status(201).json({ task });
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const updateTask = async (req, res, next) => {
    try {
        if (!req.userId)
            return res.status(401).json({ message: "Unauthorized" });
        const task = await taskService_1.taskService.updateTask(req.params.id, req.body, req.userId);
        res.json({ task });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        if (!req.userId)
            return res.status(401).json({ message: "Unauthorized" });
        await taskService_1.taskService.deleteTask(req.params.id, req.userId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
const listTasks = async (req, res, next) => {
    try {
        if (!req.userId)
            return res.status(401).json({ message: "Unauthorized" });
        const { filter, status, priority, sort } = req.query;
        const tasks = await taskService_1.taskService.listTasks(req.userId, filter, status, priority, sort);
        res.json({ tasks });
    }
    catch (error) {
        next(error);
    }
};
exports.listTasks = listTasks;
//# sourceMappingURL=taskController.js.map