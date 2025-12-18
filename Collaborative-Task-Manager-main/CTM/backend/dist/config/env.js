"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: parseInt(process.env.PORT || "4000", 10),
    mongoUri: process.env.MONGO_URI ||
        "mongodb+srv://sumitkumartiwari627_db_user:v3hPSBknX403GVSV@cluster0.2tj59wn.mongodb.net/",
    jwtSecret: process.env.JWT_SECRET || "dev_secret",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
    cookieName: process.env.COOKIE_NAME || "taskmgr_token",
    nodeEnv: process.env.NODE_ENV || "development",
};
//# sourceMappingURL=env.js.map