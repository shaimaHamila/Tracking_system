import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import { socketAuthentication } from "../src/middlewares/authMiddleware";
import { RoleId } from "../src/types/Roles";
const allowedRoleIds: RoleId[] = [1, 2, 3, 4, 5];
const SocketConnect = (app: express.Application) => {
  console.log("Socket is running... 🥳");

  // Socket connection
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Use socket authentication middleware
  io.use((socket: Socket, next) => {
    socketAuthentication(socket, (error) => {
      if (error) {
        socket.emit("error", { message: "Authentication failed 🤦‍♀️", error });
        socket.disconnect(true);
      } else {
        next();
      }
    });
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.decodedToken;

    if (user) {
      socket.on("joinRoom", () => {
        if (allowedRoleIds.includes(user.roleId)) {
          socket.join("tickets");
          socket.join("comments");
          console.log(`User ${user.firstName} joined all notification rooms.`);
        }
      });

      socket.on("disconnect", () => {
        console.log("User: " + user.firstName + " - has disconnected! 😞");
      });
    }
  });

  return { server, io };
};
export default SocketConnect;
