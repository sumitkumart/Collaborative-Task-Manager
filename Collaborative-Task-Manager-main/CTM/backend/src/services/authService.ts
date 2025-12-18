import bcrypt from "bcryptjs";
import { UserModel, IUser } from "../models/User";
import { AppError } from "../utils/errors";
import { signToken } from "../utils/token";

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hashed });
    const userId = user._id.toString();
    const token = signToken(userId);

    return { user: sanitize(user), token };
  },

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = signToken(user._id.toString());
    return { user: sanitize(user), token };
  },

  async me(userId: string): Promise<ReturnType<typeof sanitize>> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return sanitize(user);
  },
};

const sanitize = (user: IUser) => {
  const { password: _password, ...rest } = user.toObject();
  return { ...rest, _id: user._id.toString() };
};
