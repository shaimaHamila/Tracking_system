import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import { socketAuthentication } from "../src/middlewares/authMiddleware";

import { Encrypt } from "../src/helpers/Encrypt";
import chalk from "chalk";
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

  // // Use socket authentication middleware
  // io.use((socket: Socket, next) => {
  //   socketAuthentication(socket, (error) => {
  //     if (error) {
  //       socket.emit("error", { message: "Authentication failed 🤦‍♀️", error });
  //       socket.disconnect(true);
  //     } else {
  //       next();
  //     }
  //   });
  // });

  io.on("connection", (socket: Socket) => {
    console.log(chalk.green("Connect User", socket.id));
    socket.on("joinRoom", () => {
      const token = socket.handshake.auth.token;
      console.log(chalk.green("Connect User", socket.id));
      try {
        if (token) {
          const currentUser = Encrypt.verifyAccessToken(token);
          if (currentUser) {
            socket.join(currentUser.id?.toString());
            console.log(chalk.bgBlue("Joined User", currentUser.id.toString()));
            socket.data.currentUser = currentUser;
          }
        }
      } catch (error) {
        console.log("User has encountered an error! 😱");
        socket.emit("error", error);
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
