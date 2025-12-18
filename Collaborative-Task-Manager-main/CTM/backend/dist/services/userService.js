"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const User_1 = require("../models/User");
exports.userService = {
    async listUsers() {
        return User_1.UserModel.find({}, "name email");
    },
};
//# sourceMappingURL=userService.js.map