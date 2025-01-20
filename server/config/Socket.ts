import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import chalk from "chalk";
import { Encrypt } from "../src/helpers/Encrypt";

const SocketConnect = (app: express.Application) => {
  console.log("Socket is running... 🥳");

  // Socket connection
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(chalk.green("Connect Userrrr", socket.id));
    socket.on("joinRoom", () => {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.error(chalk.red("Missing token during connection."));
        socket.emit("error", "Authentication token required");
        return socket.disconnect(true);
      }
      console.log(chalk.green("Connect User with tocken", socket.id));
      try {
        // Verify token and extract user details
        const currentUser = Encrypt.verifyAccessToken(token);

        if (currentUser) {
          console.log(chalk.blue("User authenticated:", "currentUser.id"));
          socket.join(currentUser.id.toString()); // Join the user-specific room
        } else {
          throw new Error("Invalid token: User not found");
        }
      } catch (error: any) {
        console.log(
          chalk.red("User has encountered an error! 😱", error.message)
        );
        socket.emit("error", "Authentication failed. Please check your token.");
        socket.disconnect(true);
      }
    });
    socket.on("disconnect", () => {
      console.log(chalk.red("Disconnect user! 😞", socket.id));
    });
  });

  return { server, io };
};
export default SocketConnect;
