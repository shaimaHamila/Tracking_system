import e, { Request, Response } from "express";
import prisma from "../prisma";
import { UserSignupValidator } from "../validators/AuthValidator";
import { encrypt } from "../helpers/encrypt";

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
    const { firstName, lastName, email, password, roles } = req.body; // Expecting roles as an array of strings or numbers

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await encrypt.encryptpass(password);

    // Create the new user without the roles association first
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    // Now handle the roles association separately
    const rolesToAssign =
      roles && roles.length > 0
        ? roles.map((roleId: string) => parseInt(roleId))
        : [2]; // Default to 'STAFF' role (ID: 2) if no roles provided

    // Insert each role for the newly created user into the join table
    await prisma.userRole.createMany({
      data: rolesToAssign.map((roleId: number) => ({
        userId: newUser.id,
        roleId,
      })),
    });

    // Fetch the updated user with the assigned roles
    const updatedUser = await prisma.user.findUnique({
      where: { id: newUser.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                roleName: true,
              },
            },
          },
        },
      },
    });

    // Format the roles to return them as a flat array instead of nested objects
    const formattedRoles =
      updatedUser?.roles.map((roleAssociation) => ({
        id: roleAssociation.role.id,
        roleName: roleAssociation.role.roleName,
      })) || [];

    // Return success response with user data and formatted roles
    return res.status(201).json({
      success: true,
      message: "User successfully created",
      user: {
        id: updatedUser?.id,
        firstName: updatedUser?.firstName,
        lastName: updatedUser?.lastName,
        email: updatedUser?.email,
        createdAt: updatedUser?.createdAt,
        roles: formattedRoles, // Return the roles with id and roleName
      },
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
