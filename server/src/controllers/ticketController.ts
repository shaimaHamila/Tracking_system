import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/Responses";
import { validateUserRole } from "./RoleController";
import { createTicketValidator } from "../validators/TicketValidator";
import { getCurrentUser } from "../helpers/GetCurrentUser";
import { Role } from "../types/Roles";
import { ProjectType } from "../types/Project";

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Get all ticket Priorities
export const getTicketPriorities = async (req: Request, res: Response) => {
  try {
    const ticketTypes = Object.values(TicketPriority);
    return Responses.OperationSuccess(res, ticketTypes);
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
    const defaultStatusId = 1; // Assume 1 is the default status for 'New' tickets
    const defaultPriority = TicketPriority.MEDIUM;

    // Use the provided values or default ones
    const finalStatusId = statusId || defaultStatusId;
    const finalPriority = priority || defaultPriority;

    if (
      (user.role.roleName === Role.ADMIN ||
        user.role.roleName === Role.STAFF) &&
      projectExists.projectType === ProjectType.EXTERNAL
    ) {
      // Assign the project managers to the ticket
      ticketData.assignedUsers = [{ userId: projectExists.technicalManagerId }];
    }

    if (
      (user.role.roleName === Role.ADMIN ||
        user.role.roleName === Role.CLIENT) &&
      projectExists.projectType == ProjectType.INTERNAL
    ) {
      ticketData.assignedUsers = projectExists.managers.map((manager) => ({
        userId: manager.manager.id,
      }));
    }

    //statusId and priority if not exist then set default values

    const ticket = await prisma.ticket.create({
      data: {
        ...ticketData,
        project: { connect: { id: projectId } },
        status: { connect: { id: finalStatusId } },
        priority: finalPriority,
        assignedUsers: {
          create: ticketData.assignedUsers,
        },
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: true,
      },
    });
    return Responses.CreateSucess(res, ticket);
  } catch (error) {
    return Responses.InternalServerError(res, "Internal server error.");
  }
};
