"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const errors_1 = require("../utils/errors");
const token_1 = require("../utils/token");
exports.authService = {
    async register(name, email, password) {
        const existing = await User_1.UserModel.findOne({ email });
        if (existing) {
            throw new errors_1.AppError("Email already in use", 409);
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.UserModel.create({ name, email, password: hashed });
        const userId = user._id.toString();
        const token = (0, token_1.signToken)(userId);
        return { user: sanitize(user), token };
    },
    async login(email, password) {
        const user = await User_1.UserModel.findOne({ email });
        if (!user) {
            throw new errors_1.AppError("Invalid credentials", 401);
        }
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid) {
            throw new errors_1.AppError("Invalid credentials", 401);
        }
        const token = (0, token_1.signToken)(user._id.toString());
        return { user: sanitize(user), token };
    },
    async me(userId) {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            throw new errors_1.AppError("User not found", 404);
        }
        return sanitize(user);
    },
};
const sanitize = (user) => {
    const { password: _password, ...rest } = user.toObject();
    return { ...rest, _id: user._id.toString() };
};
//# sourceMappingURL=authService.js.map