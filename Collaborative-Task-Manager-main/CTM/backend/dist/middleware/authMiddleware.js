"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const authMiddleware = (req, _res, next) => {
    const token = req.cookies?.[env_1.env.cookieName];
    if (!token) {
        return next(new errors_1.AppError("Unauthorized", 401));
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        req.userId = payload.sub;
        return next();
    }
    catch (err) {
        return next(new errors_1.AppError("Unauthorized", 401));
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map