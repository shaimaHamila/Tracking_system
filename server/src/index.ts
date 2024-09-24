import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import cors from "cors";
import prisma from "./prisma";
import authRouter from "./routes/authRouter";
import { setupSwagger } from "./swagger";
//For env File
dotenv.config();

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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
  res.send(
    "Welcome to Expresssssssssss & backend is connected successfully 🥳"
  );
});

// setup swagger api docs
setupSwagger(app);

//Routes
app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
  console.log(`Express is runnung attt http://localhost:${port} 🥳`);
});
