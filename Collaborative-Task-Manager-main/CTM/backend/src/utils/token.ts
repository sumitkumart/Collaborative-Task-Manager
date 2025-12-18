import { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const expiresInDays = 7;

export const signToken = (userId: string) => {
  return jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: `${expiresInDays}d`,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as { sub: string };
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: expiresInDays * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookie = (res: Response) => {
  res.cookie(env.cookieName, "", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    expires: new Date(0),
  });
};
