import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/Responses";
import {
  createTicketValidator,
  updateTicketValidator,
} from "../validators/TicketValidator";
import { getCurrentUser } from "../helpers/GetCurrentUser";
import { Role, RoleType } from "../types/Roles";
import { ProjectType } from "../types/Project";
import { TicketPriority, TicketStatus, TicketType } from "../types/Ticket";
import { isProjectManager } from "../helpers/IsProjectManager ";
import { validateUserRole } from "./RoleController";

// Get all ticket Priorities
export const getTicketPriorities = async (_req: Request, res: Response) => {
  try {
    const ticketTypes = Object.values(TicketPriority);
    return Responses.OperationSuccess(res, ticketTypes);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Get all ticket status
export const getTicketStatuses = async (_req: Request, res: Response) => {
  try {
    const ticketStatuses = await prisma.ticket_status.findMany();
    return Responses.OperationSuccess(res, ticketStatuses);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Get all ticket types
export const getTicketTypes = async (_req: Request, res: Response) => {
  try {
    const ticketType = Object.values(TicketType);
    return Responses.OperationSuccess(res, ticketType);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

// Create new ticket
export const createTicket =
  (io: any) => async (req: Request, res: Response) => {
    const { error } = createTicketValidator.validate(req.body);
    if (error) {
      return Responses.ValidationBadRequest(res, error);
    }

    try {
      const { projectId, equipmentId, priority, ...ticketData } = req.body;

      const createdById = res.locals.decodedToken.id;

      let user;
      try {
        user = await getCurrentUser(parseInt(createdById, 10));
      } catch (error: any) {
        return Responses.BadRequest(res, error.message);
      }
      if (equipmentId) {
        const equipmentExists = await prisma.equipment.findUnique({
          where: { id: equipmentId },
        });

        if (!equipmentExists) {
          return Responses.BadRequest(
            res,
            "Invalid equipment ID: Equipment does not exist."
          );
        } else {
          await prisma.equipment.update({
            where: { id: equipmentId },
            data: { condition: "DAMAGED" },
          });
        }
      }
      const projectExists = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          managers: {
            include: {
              manager: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!projectExists) {
        return Responses.BadRequest(
          res,
          "Invalid project ID: Project does not exist."
        );
      }
      // Set default statusId and priority if they are not provided
      const defaultStatusId = TicketStatus.OPEN;
      const defaultPriority = TicketPriority.MEDIUM;

      // Use the provided values or default ones
      const finalPriority = priority || defaultPriority;
      if (
        (user.role.roleName == Role.ADMIN ||
          user.role.roleName == Role.STAFF) &&
        projectExists.projectType == ProjectType.INTERNAL
      ) {
        // Assign the technical manager to the ticket
        ticketData.assignedUsers = [
          { userId: projectExists.technicalManagerId },
        ];
      } else if (
        (user.role.roleName == Role.ADMIN ||
          user.role.roleName == Role.CLIENT) &&
        projectExists.projectType == ProjectType.EXTERNAL
      ) {
        // Assign the project managers to the ticket
        ticketData.assignedUsers = projectExists.managers.map((manager) => ({
          userId: manager.manager.id,
        }));
      } else {
        // If neither condition matches, return a Bad Request response
        return Responses.BadRequest(res, "Bad Request.");
      }

      //statusId and priority if not exist then set default values
      const ticket = await prisma.ticket.create({
        data: {
          ...ticketData,
          project: { connect: { id: projectId } },
          equipment: equipmentId ? { connect: { id: equipmentId } } : null,
          status: { connect: { id: defaultStatusId } },
          priority: finalPriority,
          createdBy: {
            connect: { id: user.id },
          },
          assignedUsers: {
            create: ticketData.assignedUsers,
          },
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          status: true,
          assignedUsers: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
      // Emit the ticketCreated event to all users in the "tickets" room
      io.to("tickets").emit("ticketCreated", ticket);
      return Responses.CreateSuccess(res, ticket);
    } catch (error) {
      return Responses.InternalServerError(res, "Internal server error.");
    }
  };

//Update ticket
export const updateTicket =
  (io: any) => async (req: Request, res: Response) => {
    const { error } = updateTicketValidator.validate(req.body);
    if (error) return Responses.ValidationBadRequest(res, error);

    const { id } = req.params;
    if (!id) return Responses.BadRequest(res, "Ticket ID is required.");

    try {
      const createdById = res.locals.decodedToken.id;
      // Verify the current user exists and handle errors
      let user;
      try {
        user = await getCurrentUser(parseInt(createdById, 10));
      } catch (error: any) {
        return Responses.BadRequest(res, error.message);
      }
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          project: {
            select: {
              id: true,
              technicalManagerId: true,
              managers: true,
            },
          },
          assignedUsers: {
            select: {
              userId: true,
            },
          },
          createdBy: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!ticket) return Responses.NotFound(res, "Ticket not found.");

      // Delegate based on user role
      if (user.id === ticket.createdById) {
        return updateTicketByCreator(ticket.id, req, res);
      }
      //updateTicketByTechnicalManager
      else if (user.id === ticket.project.technicalManagerId) {
        return updateTicketByTechnicalManager(ticket.id, req, res);
      }
      //updateTicketByProjectManager
      else if (
        isProjectManager(user, ticket.project) ||
        user.role.roleName === Role.ADMIN
      ) {
        return updateTicketByAdminOrProjectManager(
          ticket.assignedUsers,
          ticket.id,
          req,
          res
        );
      }

      //
      else {
        return Responses.Unauthorized(
          res,
          "You do not have permission to update this ticket."
        );
      }
    } catch (error) {
      return Responses.InternalServerError(res, "Internal server error.");
    }
  };

const updateTicketByCreator = async (
  ticketId: number,
  req: Request,
  res: Response
) => {
  const { title, description, type, priority } = req.body;
  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { title, description, type, priority },
  });
  return Responses.UpdateSuccess(res, updatedTicket);
};

const updateTicketByTechnicalManager = async (
  ticketId: number,
  req: Request,
  res: Response
) => {
  const { statusId, priority } = req.body;

  const updateData: any = {};
  if (statusId) updateData.status = { connect: { id: statusId } };
  if (priority) updateData.priority = priority;

  if (!statusId && !priority) {
    return Responses.BadRequest(
      res,
      "Project Technical Manager can update status or priority."
    );
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: updateData,
    include: {
      status: true,
      assignedUsers: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
  return Responses.UpdateSuccess(res, updatedTicket);
};

const updateTicketByAdminOrProjectManager = async (
  oldAssignedUsers: any,
  ticketId: number,
  req: Request,
  res: Response
) => {
  const { assignedUsers, statusId, priority } = req.body;

  const updateData: any = {};
  if (statusId) updateData.status = { connect: { id: statusId } };
  if (priority) updateData.priority = priority;

  if (!Object.keys(updateData).length && !assignedUsers) {
    return Responses.BadRequest(
      res,
      "Admin or Project manager can update status, priority, or assigned users."
    );
  }

  if (assignedUsers && Array.isArray(assignedUsers)) {
    if (assignedUsers.length === 0) {
      return Responses.BadRequest(
        res,
        "The ticket must be assigned to at least one user."
      );
    }
    // Validate assignedUsers Role
    try {
      await Promise.all(
        assignedUsers.map((userId: number) =>
          validateUserRole(userId, Role.STAFF)
        )
      );
    } catch (validationError: any) {
      return Responses.BadRequest(res, validationError.message);
    }

    // Update assigned users
    await updateTicketAssignedUsers(ticketId, assignedUsers, oldAssignedUsers);
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: updateData,
    include: {
      project: {
        select: {
          id: true,
          name: true,

          technicalManagerId: true,
          managers: true,
        },
      },
      status: true,
      assignedUsers: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
  return Responses.UpdateSuccess(res, updatedTicket);
};

// Helper to validate and update assigned users
const updateTicketAssignedUsers = async (
  ticketId: number,
  assignedUsers: number[],
  oldAssignedUsers: any
) => {
  // Get existing assigned users
  const existingAssignedUsersIds = oldAssignedUsers.map(
    (user: any) => user.userId
  );

  // Determine managers to delete
  const assignedUsersToDelete = existingAssignedUsersIds.filter(
    (userId: number) => !assignedUsers.includes(userId)
  );

  // Determine assigned users to add
  const assignedUsersToAdd = assignedUsers.filter(
    (userId: number) => !existingAssignedUsersIds.includes(userId)
  );
  // Delete old assigned users
  if (assignedUsersToDelete.length) {
    await prisma.user_ticket.deleteMany({
      where: {
        ticketId,
        userId: { in: assignedUsersToDelete },
      },
    });
  }

  // Add new assigned users
  if (assignedUsersToAdd.length) {
    await prisma.user_ticket.createMany({
      data: assignedUsersToAdd.map((userId: number) => ({
        ticketId,
        userId,
      })),
    });
  }
};

// Get all tickets :
// by project type | by creator | by status | by priority | by type | by assigned user | by project
// they are all optinal
// with pagination
//who can see all the tickets?
// If Admin : can see all tickets
// If TM can : see all external project tickets
// If staff or created by him : can see all tickets assigned to him
// If client : can see all tickets of his projects
export const getAllTickets = async (req: Request, res: Response) => {
  const {
    projectType,
    statusId,
    priority,
    type,
    assignedUserId,
    projectId,
    title,
    page = "1",
    pageSize = "10",
  } = req.query as {
    projectType?: string;
    statusId?: string;
    priority?: TicketPriority;
    type?: TicketType;
    assignedUserId?: string;
    projectId?: string;
    title?: string;
    page?: string;
    pageSize?: string;
  };

  // Set pagination variables
  const take = Math.max(parseInt(pageSize, 10) || 10, 1);
  const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * take;

  try {
    const userId = res.locals.decodedToken.id; // Get user ID from token
    const user = await getCurrentUser(userId);

    const whereClause: any = {
      ...(title &&
        title !== "null" && {
          title: { contains: title, mode: "insensitive" },
        }),
      ...(projectId && { projectId: parseInt(projectId, 10) }),
      ...(statusId && { statusId: parseInt(statusId, 10) }),
      ...(priority && { priority }),
      ...(type && { type }),
      ...(projectType && { project: { projectType } }),
      ...(assignedUserId && {
        assignedUsers: {
          some: { userId: parseInt(assignedUserId, 10) },
        },
      }),
    };

    // Apply role-based filtering
    applyRoleBasedFilter(user.id, user.role.roleName as RoleType, whereClause);

    // Fetch tickets and total count in parallel
    const [tickets, totalTickets] = await Promise.all([
      prisma.ticket.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          status: true,
          project: {
            select: {
              id: true,
              name: true,
              projectType: true,
              managers: {
                include: {
                  manager: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          assignedUsers: {
            select: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        skip,
        take,
      }),
      prisma.ticket.count({ where: whereClause }),
    ]);

    const transformedTickets = tickets.map((ticket) => ({
      ...ticket,
      assignedUsers: ticket.assignedUsers.map(({ user }) => user), // Flatten user details
      assignedUsersId: ticket.assignedUsers.map(({ user }) => user.id), // Extract user IDs
      managersId: ticket.project.managers.map(({ manager }) => manager.id), // Extract manager IDs
    }));
    return Responses.FetchPagedSucess(res, {
      data: transformedTickets,
      meta: {
        totalCount: totalTickets,
        totalPages: Math.ceil(totalTickets / take),
        currentPage: parseInt(page, 10),
        pageSize: Math.ceil(totalTickets / take),
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Helper function to apply role-based filtering
const applyRoleBasedFilter = (
  userId: number,
  userRole: RoleType,
  whereClause: any
) => {
  switch (userRole) {
    case Role.ADMIN:
      // Admin can see all tickets
      break;
    case Role.TECHNICAL_MANAGER:
      // TM can see only external project tickets
      whereClause.project = {
        ...whereClause.project,
        projectType: ProjectType.EXTERNAL,
      };
      break;
    case Role.STAFF:
      // Staff can see tickets assigned to them or created by them
      whereClause.OR = [
        { createdById: userId },
        { assignedUsers: { some: { userId: userId } } },
      ];
      break;
    case Role.CLIENT:
      // Client can see tickets related to their projects
      whereClause.project = { ...whereClause.project, clientId: userId };
      break;
    default:
      throw new Error("Unauthorized access");
  }
};

// Get ticket by id
export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return Responses.NotFound(res, "Ticket id is required");
  }
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: {
        status: true,
        project: {
          select: {
            id: true,
            name: true,
            projectType: true,
          },
        },
        assignedUsers: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      return Responses.NotFound(res, "Ticket not found");
    }
    return Responses.OperationSuccess(res, ticket);
  } catch (error) {
    return Responses.InternalServerError(res, "Error fetching ticket");
  }
};

// Delete Ticket
export const deleteTicket =
  (io: any) => async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return Responses.NotFound(res, "Ticket id is required");
    }
    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id: Number(id) },
        include: {
          project: true,
        },
      });

      if (!ticket) {
        return Responses.NotFound(res, "Ticket not found");
      }
      const userId = res.locals.decodedToken.id;

      // Verify the current user exists and handle errors
      let user;
      try {
        user = await getCurrentUser(parseInt(userId, 10));
      } catch (error: any) {
        return Responses.BadRequest(res, error.message);
      }

      const isCreator = ticket.createdById === user.id;
      const isAdmin = user.role.roleName === Role.ADMIN;

      if (!isAdmin && !isCreator) {
        return Responses.Forbidden(
          res,
          "You are not authorized to delete this ticket, onle admin or creator can delete the ticket"
        );
      }

      // Proceed with deleting the ticket
      await prisma.ticket.delete({
        where: { id: Number(id) },
      });

      return Responses.DeleteSuccess(res);
    } catch (error) {
      return Responses.InternalServerError(res, "Error deleting ticket");
    }
  };
