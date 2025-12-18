"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const setup_1 = require("./setup");
const User_1 = require("../src/models/User");
vitest_1.vi.mock("../src/socket/socket", () => ({
    emitTaskEvent: vitest_1.vi.fn(),
    emitToUser: vitest_1.vi.fn(),
    initSocket: vitest_1.vi.fn(),
}));
const socket_1 = require("../src/socket/socket");
const taskService_1 = require("../src/services/taskService");
(0, vitest_1.describe)("Socket notifications", () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, setup_1.connectTestDB)();
    });
    (0, vitest_1.afterEach)(async () => {
        await (0, setup_1.clearDB)();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.afterAll)(async () => {
        await (0, setup_1.closeTestDB)();
    });
    (0, vitest_1.it)("emits socket events when assigning a task", async () => {
        const creator = await User_1.UserModel.create({
            name: "Creator",
            email: "creator@test.com",
            password: await bcryptjs_1.default.hash("pass1234", 10),
        });
        const assignee = await User_1.UserModel.create({
            name: "Assignee",
            email: "assignee@test.com",
            password: await bcryptjs_1.default.hash("pass1234", 10),
        });
        const task = await taskService_1.taskService.createTask({
            title: "Socket task",
            assignedToId: assignee.id,
            priority: "medium",
        }, creator.id);
        (0, vitest_1.expect)(task.title).toBe("Socket task");
        (0, vitest_1.expect)(socket_1.emitTaskEvent.mock.calls[0][0]).toBe("task:created");
        (0, vitest_1.expect)(socket_1.emitToUser.mock.calls[0][0]).toBe(assignee.id);
        (0, vitest_1.expect)(socket_1.emitToUser.mock.calls[0][1]).toBe("task:assigned");
    });
});
//# sourceMappingURL=socket.test.js.map