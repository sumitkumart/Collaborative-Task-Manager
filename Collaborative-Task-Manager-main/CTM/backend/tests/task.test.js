"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../src/app");
const User_1 = require("../src/models/User");
const setup_1 = require("./setup");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app = (0, app_1.createApp)();
(0, vitest_1.describe)("Task routes", () => {
    let authCookie;
    let userId;
    (0, vitest_1.beforeAll)(async () => {
        await (0, setup_1.connectTestDB)();
    });
    (0, vitest_1.afterEach)(async () => {
        await (0, setup_1.clearDB)();
    });
    (0, vitest_1.afterAll)(async () => {
        await (0, setup_1.closeTestDB)();
    });
    const register = async () => {
        const res = await (0, supertest_1.default)(app).post("/api/auth/register").send({
            name: "Creator",
            email: "creator@test.com",
            password: "strongpass",
        });
        authCookie = res.headers["set-cookie"];
        userId = res.body.user._id;
    };
    (0, vitest_1.it)("creates a task with assignment and respects max title length", async () => {
        await register();
        const assignee = await User_1.UserModel.create({
            name: "Assignee",
            email: "assignee@test.com",
            password: await bcryptjs_1.default.hash("123456", 10),
        });
        const res = await (0, supertest_1.default)(app)
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
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body.task.title).toBe("Important task");
        (0, vitest_1.expect)(res.body.task.creatorId._id ?? res.body.task.creatorId).toBe(userId);
        (0, vitest_1.expect)(res.body.task.assignedToId._id).toBe(assignee.id);
    });
});
//# sourceMappingURL=task.test.js.map