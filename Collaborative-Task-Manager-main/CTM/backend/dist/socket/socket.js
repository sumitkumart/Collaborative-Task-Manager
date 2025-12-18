"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitToUser = exports.emitTaskEvent = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const env_1 = require("../config/env");
const token_1 = require("../utils/token");
let ioInstance = null;
const userSocketMap = new Map();
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: env_1.env.clientUrl, credentials: true },
    });
    io.on("connection", (socket) => handleConnection(socket));
    ioInstance = io;
    return io;
};
exports.initSocket = initSocket;
const handleConnection = (socket) => {
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
const getUserIdFromSocket = (socket) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader)
        return null;
    const cookies = Object.fromEntries(cookieHeader.split(";").map((c) => {
        const [key, ...rest] = c.trim().split("=");
        return [key, rest.join("=")];
    }));
    const token = cookies[env_1.env.cookieName];
    if (!token)
        return null;
    try {
        const payload = (0, token_1.verifyToken)(token);
        return payload.sub;
    }
    catch (error) {
        return null;
    }
};
const getIo = () => ioInstance;
const emitTaskEvent = (event, payload) => {
    const io = getIo();
    if (!io)
        return;
    io.emit(event, payload);
};
exports.emitTaskEvent = emitTaskEvent;
const emitToUser = (userId, event, payload) => {
    const io = getIo();
    if (!io)
        return;
    const socketId = userSocketMap.get(userId);
    if (socketId) {
        io.to(socketId).emit(event, payload);
    }
};
exports.emitToUser = emitToUser;
//# sourceMappingURL=socket.js.map