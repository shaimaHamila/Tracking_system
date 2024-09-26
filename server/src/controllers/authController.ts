import { Request, Response } from "express";
import prisma from "../prisma";

export const signup = async (req: Request, res: Response) => {
  const { firstName, email } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user

    return res.json("newUser");
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
