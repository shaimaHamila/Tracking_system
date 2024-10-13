import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/Responses";
import { createTicketValidator } from "../validators/TicketValidator";
import { getCurrentUser } from "../helpers/GetCurrentUser";
import { Role } from "../types/Roles";
import { ProjectType } from "../types/Project";
import { TicketPriority, TicketStatus, TicketType } from "../types/Ticket";

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
    const defaultStatusId = 1;
    const defaultPriority = TicketPriority.MEDIUM;

    // Use the provided values or default ones
    const finalPriority = priority || defaultPriority;

    if (
      (user.role.roleName === Role.ADMIN ||
        user.role.roleName === Role.STAFF) &&
      projectExists.projectType === ProjectType.EXTERNAL
    ) {
      // Assign the project managers to the ticket
      console.log(
        "technicalManagerIdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        projectExists.technicalManagerId
      );
      ticketData.assignedUsers = [{ userId: projectExists.technicalManagerId }];
    } else if (
      (user.role.roleName === Role.ADMIN ||
        user.role.roleName === Role.CLIENT) &&
      projectExists.projectType == ProjectType.INTERNAL
    ) {
      ticketData.assignedUsers = projectExists.managers.map((manager) => ({
        userId: manager.manager.id,
      }));
      console.log(
        "projectExists.managersaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        projectExists.managers
      );
    } else {
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
