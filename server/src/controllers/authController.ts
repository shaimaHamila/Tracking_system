import { Request, Response } from "express";
import {
  UserLoginValidator,
  UserSignupValidator,
} from "../validators/AuthValidator";
import { encrypt } from "../helpers/encrypt";
import prisma from "../prisma";

export const signup = async (req: Request, res: Response) => {
  // Validate the user input
  const { error } = UserSignupValidator.validate(req.body);
  if (error) {
    console.error("Error during user signup validation:", error);
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { firstName, lastName, email, password, roleId } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await encrypt.encryptpass(password);

    // Default role to 'STAFF' (ID: 2) if not provided
    const roleToAssign = roleId ? parseInt(roleId) : 2;

    // Create the new user with the associated role
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: {
          connect: { id: roleToAssign }, // Assign the role using the nested relation
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            roleName: true,
          },
        },
      },
    });

    // Return success response with user data and role information
    return res.status(201).json({
      success: true,
      message: "User successfully created",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        createdAt: newUser.createdAt,
        role: {
          id: newUser.role.id,
          roleName: newUser.role.roleName,
        },
      },
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  // Validate the user input
  const { error } = UserLoginValidator.validate(req.body);
  if (error) {
    console.error("Error during user login validation:", error);
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          select: {
            id: true,
            roleName: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await encrypt.comparepassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate JWT tokens
    const accessToken = encrypt.generateToken(user);
    const refreshToken = encrypt.generateRefreshToken(user);

    // Return success response with user data and role information
    return res.status(200).json({
      success: true,
      message: "User successfully logged in",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        role: {
          id: user.role?.id,
          roleName: user.role?.roleName,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
