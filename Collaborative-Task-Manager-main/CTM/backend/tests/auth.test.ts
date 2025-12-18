import request from "supertest";
import { beforeAll, afterAll, afterEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { connectTestDB, clearDB, closeTestDB } from "./setup";

const app = createApp();

describe("Auth routes", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it("registers a user and sets httpOnly cookie", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@test.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("alice@test.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("logs in an existing user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Bob",
      email: "bob@test.com",
      password: "pass1234",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "bob@test.com",
      password: "pass1234",
    });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Bob");
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
