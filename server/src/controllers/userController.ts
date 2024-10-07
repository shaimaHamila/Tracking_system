import { Request, Response } from "express";
import { Responses } from "../helpers/Responses";
import prisma from "../prisma";
import { createUserValidator } from "../validators/UserValidator";
import { encrypt } from "../helpers/Encrypt";

// Create new user
export const createUser = async (req: Request, res: Response) => {
  const { error } = createUserValidator.validate(req.body);
  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }

  try {
    const { email, password, roleId, ...userData } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Responses.AlreadyExists(res, "User already exists.");
    }

    // Hash the password before storing it
    const hashedPassword = await encrypt.encryptpass(password);

    // Validate if the provided roleId exists in the database
    const roleExists = await prisma.user_role.findUnique({
      where: { id: roleId },
    });

    if (!roleExists) {
      return Responses.BadRequest(res, "Invalid role ID: Role does not exist.");
    }

    // Default role to 'STAFF' (ID: 2) if not provided
    const roleToAssign = roleId ? parseInt(roleId) : 2;

    const user = await prisma.user.create({
      data: {
        ...userData,
        email,
        password: hashedPassword,
        role: {
          connect: { id: roleToAssign },
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
    return Responses.CreateSucess(res, user);
  } catch (error) {
    console.error("Error creating user:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};
