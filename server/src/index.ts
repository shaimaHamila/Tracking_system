import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import cors from "cors";
import prisma from "./prisma";
import { setupSwagger } from "./swagger";
import SocketConnect from "../config/Socket";
import AuthRouter from "./routes/AuthRouter";
import ProjectRouter from "./routes/ProjectRouter";
import CommentRouter from "./routes/CommentRouter";
import EquipmentRouter from "./routes/EquipmentRouter";
import TicketRouter from "./routes/TicketRouter";
import UserRouter from "./routes/UserRouter";
//For env File
dotenv.config();

const app: Application = express();
const { server, io } = SocketConnect(app);

// Middleware
app.use(
  cors({
    origin: [
      `${process.env.FRONTEND_URL}`, // Allow requests from your frontend URL
      "http://localhost:3001", // Allow requests from localhost:3000
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(bodyParser.json());

const port = process.env.APP_PORT || 6001;

// Graceful shutdown for Prisma
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected on server termination.");
});

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Welcome to Expres  & backend is connected successfully 🥳");
});

// setup swagger api docs
setupSwagger(app);

//Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/project", ProjectRouter);
app.use("/api/v1/equipment", EquipmentRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/ticket", TicketRouter(io));
app.use("/api/v1/comment", CommentRouter(io));

server.listen(port, () => {
  console.log(`Express is runnung attt http://localhost:${port} 🥳`);
});
