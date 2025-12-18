"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const token_1 = require("../utils/token");
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const { user, token } = await authService_1.authService.register(name, email, password);
        (0, token_1.setAuthCookie)(res, token);
        res.status(201).json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService_1.authService.login(email, password);
        (0, token_1.setAuthCookie)(res, token);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logout = async (_req, res, next) => {
    try {
        (0, token_1.clearAuthCookie)(res);
        res.json({ message: "Logged out" });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const me = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await authService_1.authService.me(req.userId);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
//# sourceMappingURL=authController.js.map