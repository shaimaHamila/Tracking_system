import { Request, Response } from "express";
import {
  UserLoginValidator,
  UserSignupValidator,
} from "../validators/AuthValidator";
import { Encrypt } from "../helpers/Encrypt";
import prisma from "../prisma";

import { TokenResultType } from "../types/TokenResultType";
import { Responses } from "../helpers/Responses";
import { RoleType } from "../types/Roles";

// User signup function
export const signup = async (req: Request, res: Response) => {
  // Validate the user input
  const { error } = UserSignupValidator.validate(req.body);
  if (error) {
    console.error("Error during user signup validation:", error);
    return Responses.ValidationBadRequest(res, error);
  }

  try {
    const { firstName, lastName, email, password, roleId } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Responses.AlreadyExists(res, "User already exists.");
    }

    // Hash the password before storing it
    const hashedPassword = await Encrypt.encryptpass(password);

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

    // Use structured success response
    return Responses.CreateSucess(res, {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      createdAt: newUser.createdAt,
      role: {
        id: newUser.role.id,
        roleName: newUser.role.roleName,
      },
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// User login function
export const login = async (req: Request, res: Response) => {
  // Validate the user input
  const { error } = UserLoginValidator.validate(req.body);
  if (error) {
    console.error("Error during user login validation:", error);
    return Responses.ValidationBadRequest(res, error);
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
      return Responses.NotFound(res, "User not found.");
    }

    // Check if the password is correct
    const isPasswordCorrect = await Encrypt.comparepassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return Responses.Unauthorized(res, "Invalid password.");
    }

    // Generate JWT tokens
    const accessToken = Encrypt.generateToken({
      id: user.id,
      role: user.role?.roleName as RoleType,
    });
    const refreshToken = Encrypt.generateRefreshToken({
      id: user.id,
      role: user.role?.roleName as RoleType,
    });

    // Construct the token result for response
    const tokenResult: TokenResultType = { accessToken, refreshToken };

    // Use structured login success response
    return Responses.LoginSuccess(
      res,
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        role: {
          id: user.role?.id,
          roleName: user.role?.roleName,
        },
      },
      tokenResult
    );
  } catch (error) {
    console.error("Error during user login:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};
