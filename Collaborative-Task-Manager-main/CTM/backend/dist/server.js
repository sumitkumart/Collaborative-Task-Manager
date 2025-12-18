"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const env_1 = require("./config/env");
const socket_1 = require("./socket/socket");
const start = async () => {
    await mongoose_1.default.connect(env_1.env.mongoUri, { dbName: "collaborative_task_manager" });
    const app = (0, app_1.createApp)();
    const server = http_1.default.createServer(app);
    (0, socket_1.initSocket)(server);
    server.listen(env_1.env.port, () => {
        console.log(`API running on port ${env_1.env.port}`);
    });
};
start().catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map