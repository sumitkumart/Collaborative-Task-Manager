import { UserModel } from "../models/User";

export const userService = {
  async listUsers() {
    return UserModel.find({}, "name email");
  },
};
