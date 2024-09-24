// prisma.ts
import { PrismaClient } from "@prisma/client";

// Create a single Prisma instance
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable detailed logging in development
});

export default prisma;
