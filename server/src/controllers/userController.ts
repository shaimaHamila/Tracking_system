import { Request, Response } from "express";
import { Responses } from "../helpers/Responses";
import prisma from "../prisma";
import {
  createUserValidator,
  updateUserValidator,
} from "../validators/UserValidator";
import { Encrypt } from "../helpers/Encrypt";
import { getCurrentUser } from "../helpers/GetCurrentUser";

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
    const hashedPassword = await Encrypt.encryptpass(password);

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
    return Responses.CreateSuccess(res, user);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Get all users with filtering and pagination
export const getAllUsers = async (req: Request, res: Response) => {
  const { page, pageSize, userName, roleId } = req.query;

  const skip =
    page && pageSize ? (Number(page) - 1) * Number(pageSize) : undefined;
  const take = page && pageSize ? Number(pageSize) : undefined;

  const parsedRoleId = roleId ? parseInt(roleId.toString()) : undefined;

  try {
    let filters: any = {};

    if (userName && userName !== "null") {
      filters.OR = [
        { firstName: { contains: String(userName), mode: "insensitive" } },
        { lastName: { contains: String(userName), mode: "insensitive" } },
      ];
    }
    if (parsedRoleId) {
      filters.roleId = parsedRoleId;
    }

    const users = await prisma.user.findMany({
      where: filters,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        role: true,
        equipments: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
            condition: true,
            brand: true,
            category: true,
          },
        },
        projects: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        createdProjects: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        techManagedProjects: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        managedProjects: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                managers: {
                  select: {
                    manager: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        clientProjects: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Get the total count of users with the same filters (for consistent pagination)
    const totalCount = await prisma.user.count({
      where: filters,
    });

    // Flatten `projects` and `managedProjects` for each user
    const usersWithFlattenedProjects = users.map((user) => ({
      ...user,
      projects: user.projects.map((p) => p.project), // Flatten projects array
      managedProjects: user.managedProjects.map((p) => p.project), // Flatten managedProjects array
    }));

    const responsePayload = {
      data: usersWithFlattenedProjects,
      meta:
        page && pageSize
          ? {
              totalCount,
              totalPages: Math.ceil(totalCount / (take ?? 1)),
              currentPage: Number(page),
              pageSize: Number(pageSize),
            }
          : {
              totalCount,
            },
    };

    return Responses.FetchPagedSucess(res, responsePayload);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        role: true,
        equipments: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
            condition: true,
          },
        },
        projects: {
          // Add this section to include the projects
          select: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      return Responses.NotFound(res, "User not found.");
    }
    return Responses.FetchSucess(res, user);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

//Get current user
export const fetchCurrentUser = async (req: Request, res: Response) => {
  try {
    // Get the current user's ID from the decoded token
    const currentUserId = res.locals.decodedToken.id;

    // Verify the current user exists and handle errors
    let currentUser;
    try {
      currentUser = await getCurrentUser(parseInt(currentUserId, 10));
    } catch (error: any) {
      return Responses.BadRequest(res, error.message);
    }
    const user = await prisma.user.findUnique({
      where: { id: Number(currentUser?.id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        role: true,
        equipments: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
            condition: true,
          },
        },
        projects: {
          // Add this section to include the projects
          select: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      return Responses.NotFound(res, "User not found.");
    }
    return Responses.FetchSucess(res, user);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = updateUserValidator.validate(req.body);

  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }

  try {
    const { roleId, equipmentIds, ...updatedUserData } = req.body;

    // Validate if the provided roleId exists in the database
    if (roleId) {
      const roleExists = await prisma.user_role.findUnique({
        where: { id: roleId },
      });

      if (!roleExists) {
        return Responses.BadRequest(
          res,
          "Invalid role ID: Role does not exist."
        );
      }
    }

    // Check if all provided equipmentIds exist in the database
    if (equipmentIds && equipmentIds.length > 0) {
      const existingEquipment = await prisma.equipment.findMany({
        where: { id: { in: equipmentIds } },
        select: { id: true },
      });

      // If the number of existing equipment is less than expected, return an error
      if (existingEquipment.length !== equipmentIds.length) {
        return Responses.BadRequest(
          res,
          "Some equipment IDs are invalid or do not exist."
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...updatedUserData,
        role: roleId ? { connect: { id: roleId } } : undefined,
        equipments: equipmentIds
          ? { connect: equipmentIds.map((id: number) => ({ id })) }
          : undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        role: true,
        equipments: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
            condition: true,
          },
        },
        projects: {
          // Add this section to include the projects
          select: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
    return Responses.UpdateSuccess(res, user);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Update user password
export const updateUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword || !id) {
      return Responses.NotFound(res, "User not found.");
    }
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return Responses.NotFound(res, "User not found.");
    }
    if (newPassword?.length < 8) {
      const hashedPassword = await Encrypt.encryptpass(newPassword);

      await prisma.user.update({
        where: { id: Number(id) },
        data: {
          password: hashedPassword,
        },
      });
    }
    return Responses.UpdateSuccess(res, "Password updated successfully.");
  } catch (error) {
    console.error("Error updating password:", error);
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return Responses.NotFound(res, "User not found.");
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return Responses.DeleteSuccess(res);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};
