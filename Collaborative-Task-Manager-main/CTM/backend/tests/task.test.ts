import request from "supertest";
import {
  beforeAll,
  afterAll,
  afterEach,
  describe,
  expect,
  it,
} from "vitest";
import { createApp } from "../src/app";
import { UserModel } from "../src/models/User";
import { connectTestDB, clearDB, closeTestDB } from "./setup";
import bcrypt from "bcryptjs";

const app = createApp();

describe("Task routes", () => {
  let authCookie: string[];
  let userId: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  const register = async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Creator",
      email: "creator@test.com",
      password: "strongpass",
    });
    authCookie = res.headers["set-cookie"];
    userId = res.body.user._id;
  };

  it("creates a task with assignment and respects max title length", async () => {
    await register();
    const assignee = await UserModel.create({
      name: "Assignee",
      email: "assignee@test.com",
      password: await bcrypt.hash("123456", 10),
    });

    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", authCookie)
      .send({
        title: "Important task",
        description: "Test creation",
        priority: "high",
        status: "todo",
        assignedToId: assignee.id,
        dueDate: new Date().toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.task.title).toBe("Important task");
    expect(
      res.body.task.creatorId._id ?? res.body.task.creatorId,
    ).toBe(userId);
    expect(res.body.task.assignedToId._id).toBe(assignee.id);
  });
});
