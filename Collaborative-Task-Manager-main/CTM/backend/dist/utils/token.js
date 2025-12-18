"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookie = exports.setAuthCookie = exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const expiresInDays = 7;
const signToken = (userId) => {
    return jsonwebtoken_1.default.sign({ sub: userId }, env_1.env.jwtSecret, {
        expiresIn: `${expiresInDays}d`,
    });
};
exports.signToken = signToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
};
exports.verifyToken = verifyToken;
const setAuthCookie = (res, token) => {
    res.cookie(env_1.env.cookieName, token, {
        httpOnly: true,
        secure: env_1.env.nodeEnv === "production",
        sameSite: env_1.env.nodeEnv === "production" ? "none" : "lax",
        maxAge: expiresInDays * 24 * 60 * 60 * 1000,
    });
};
exports.setAuthCookie = setAuthCookie;
const clearAuthCookie = (res) => {
    res.cookie(env_1.env.cookieName, "", {
        httpOnly: true,
        secure: env_1.env.nodeEnv === "production",
        sameSite: env_1.env.nodeEnv === "production" ? "none" : "lax",
        expires: new Date(0),
    });
};
exports.clearAuthCookie = clearAuthCookie;
//# sourceMappingURL=token.js.map