"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = void 0;
const userService_1 = require("../services/userService");
const listUsers = async (_req, res, next) => {
    try {
        const users = await userService_1.userService.listUsers();
        res.json({ users });
    }
    catch (error) {
        next(error);
    }
};
exports.listUsers = listUsers;
//# sourceMappingURL=userController.js.map