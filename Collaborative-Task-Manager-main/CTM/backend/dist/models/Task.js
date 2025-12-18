"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true, maxlength: 100, trim: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium",
    },
    status: {
        type: String,
        enum: ["todo", "in_progress", "review", "done"],
        default: "todo",
    },
    creatorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    assignedToId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.TaskModel = (0, mongoose_1.model)("Task", taskSchema);
//# sourceMappingURL=Task.js.map