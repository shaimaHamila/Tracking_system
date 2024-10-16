import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/Responses";
import {
  createTicketValidator,
  updateTicketValidator,
} from "../validators/TicketValidator";
import { getCurrentUser } from "../helpers/GetCurrentUser";
import { Role } from "../types/Roles";
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
export const createTicket = async (req: Request, res: Response) => {
  const { error } = createTicketValidator.validate(req.body);
  if (error) {
    return Responses.ValidationBadRequest(res, error);
  }

  try {
    const { projectId, statusId, priority, ...ticketData } = req.body;

    // Get the current user's ID from the decoded token
    const createdById = res.locals.decodedToken.id;

    // Verify the current user exists and handle errors
    let user;
    try {
      user = await getCurrentUser(parseInt(createdById, 10));
    } catch (error: any) {
      return Responses.BadRequest(res, error.message);
    }

    // Verify if the provided projectId exists in the database
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
      (user.role.roleName == Role.ADMIN || user.role.roleName == Role.STAFF) &&
      projectExists.projectType == ProjectType.EXTERNAL
    ) {
      // Assign the technical manager to the ticket
      ticketData.assignedUsers = [{ userId: projectExists.technicalManagerId }];
    } else if (
      (user.role.roleName == Role.ADMIN || user.role.roleName == Role.CLIENT) &&
      projectExists.projectType == ProjectType.INTERNAL
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
    return Responses.CreateSucess(res, ticket);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};

//Update ticket
export const updateTicket = async (req: Request, res: Response) => {
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
      console.log(
        "updateTicketByCreatorUsersssssssssssssssssssssssssssssssss",
        ticket,
        user
      );
      return updateTicketByCreator(ticket.id, req, res);
    }
    //updateTicketByTechnicalManager
    else if (user.id === ticket.project.technicalManagerId) {
      console.log(
        "updateTicketByTechnicalManagerrsssssssssssssssssssssssssssssssss",
        ticket,
        user
      );
      return updateTicketByTechnicalManager(ticket.id, req, res);
    }
    //updateTicketByProjectManager
    else if (
      isProjectManager(user, ticket.project) ||
      user.role.roleName === Role.ADMIN
    ) {
      console.log(
        "updateTicketByAdminOrProjectManagerssssssssssssssssssssssssssssss",
        ticket,
        user
      );
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
