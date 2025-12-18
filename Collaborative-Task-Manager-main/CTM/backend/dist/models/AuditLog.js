"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogModel = void 0;
const mongoose_1 = require("mongoose");
const auditLogSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Task", required: true },
    fromStatus: { type: String, required: true },
    toStatus: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.AuditLogModel = (0, mongoose_1.model)("AuditLog", auditLogSchema);
//# sourceMappingURL=AuditLog.js.map