import { beforeAll, afterAll, afterEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { connectTestDB, clearDB, closeTestDB } from "./setup";
import { UserModel } from "../src/models/User";

vi.mock("../src/socket/socket", () => ({
  emitTaskEvent: vi.fn(),
  emitToUser: vi.fn(),
  initSocket: vi.fn(),
}));

import { emitTaskEvent, emitToUser } from "../src/socket/socket";
import { taskService } from "../src/services/taskService";

describe("Socket notifications", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearDB();
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it("emits socket events when assigning a task", async () => {
    const creator = await UserModel.create({
      name: "Creator",
      email: "creator@test.com",
      password: await bcrypt.hash("pass1234", 10),
    });
    const assignee = await UserModel.create({
      name: "Assignee",
      email: "assignee@test.com",
      password: await bcrypt.hash("pass1234", 10),
    });

    const task = await taskService.createTask(
      {
        title: "Socket task",
        assignedToId: assignee.id,
        priority: "medium",
      },
      creator.id,
    );

    expect(task.title).toBe("Socket task");
    expect((emitTaskEvent as any).mock.calls[0][0]).toBe("task:created");
    expect((emitToUser as any).mock.calls[0][0]).toBe(assignee.id);
    expect((emitToUser as any).mock.calls[0][1]).toBe("task:assigned");
  });
});
