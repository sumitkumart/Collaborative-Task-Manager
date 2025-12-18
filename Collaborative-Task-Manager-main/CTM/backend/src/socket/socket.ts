import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env";
import { verifyToken } from "../utils/token";

let ioInstance: Server | null = null;
const userSocketMap = new Map<string, string>();

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.on("connection", (socket) => handleConnection(socket));
  ioInstance = io;
  return io;
};

const handleConnection = (socket: Socket) => {
  const userId = getUserIdFromSocket(socket);

  if (userId) {
    userSocketMap.set(userId, socket.id);
    socket.data.userId = userId;
  }

  socket.on("disconnect", () => {
    if (userId) {
      userSocketMap.delete(userId);
    }
  });
};

const getUserIdFromSocket = (socket: Socket): string | null => {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    }),
  );
  const token = cookies[env.cookieName];
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return payload.sub;
  } catch (error) {
    return null;
  }
};

const getIo = () => ioInstance;

export const emitTaskEvent = (event: string, payload: unknown) => {
  const io = getIo();
  if (!io) return;
  io.emit(event, payload);
};

export const emitToUser = (userId: string, event: string, payload: unknown) => {
  const io = getIo();
  if (!io) return;
  const socketId = userSocketMap.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, payload);
  }
};
