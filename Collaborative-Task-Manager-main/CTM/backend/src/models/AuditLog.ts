import { Document, Schema, model, Types } from "mongoose";

export interface IAuditLog extends Document {
  userId: Types.ObjectId;
  taskId: Types.ObjectId;
  fromStatus: string;
  toStatus: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    fromStatus: { type: String, required: true },
    toStatus: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const AuditLogModel = model<IAuditLog>("AuditLog", auditLogSchema);
