"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../src/app");
const setup_1 = require("./setup");
const app = (0, app_1.createApp)();
(0, vitest_1.describe)("Auth routes", () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, setup_1.connectTestDB)();
    });
    (0, vitest_1.afterEach)(async () => {
        await (0, setup_1.clearDB)();
    });
    (0, vitest_1.afterAll)(async () => {
        await (0, setup_1.closeTestDB)();
    });
    (0, vitest_1.it)("registers a user and sets httpOnly cookie", async () => {
        const res = await (0, supertest_1.default)(app).post("/api/auth/register").send({
            name: "Alice",
            email: "alice@test.com",
            password: "password123",
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body.user.email).toBe("alice@test.com");
        (0, vitest_1.expect)(res.headers["set-cookie"]).toBeDefined();
    });
    (0, vitest_1.it)("logs in an existing user", async () => {
        await (0, supertest_1.default)(app).post("/api/auth/register").send({
            name: "Bob",
            email: "bob@test.com",
            password: "pass1234",
        });
        const res = await (0, supertest_1.default)(app).post("/api/auth/login").send({
            email: "bob@test.com",
            password: "pass1234",
        });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.user.name).toBe("Bob");
        (0, vitest_1.expect)(res.headers["set-cookie"]).toBeDefined();
    });
});
//# sourceMappingURL=auth.test.js.map