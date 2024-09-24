import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import * as bodyParser from "body-parser";
import cors from "cors";

//For env File
dotenv.config();

// Initialize Prisma client and ensure it's reused properly in production
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable detailed logs in development
});

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

//Just for testing
app.post(`/signup`, async (req: Request, res: Response) => {
  const { firstName, email } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        email,
      },
    });

    res.json(newUser);
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`Express is runnung at http://localhost:${port} 🥳`);
});
