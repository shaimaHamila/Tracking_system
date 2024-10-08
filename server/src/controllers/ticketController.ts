import { Request, Response } from "express";
import prisma from "../prisma";
import { Responses } from "../helpers/Responses";
import { validateUserRole } from "./RoleController";
import { createTicketValidator } from "../validators/TicketValidator";

export enum ticketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Get all ticket Priorities
export const getTicketPriorities = async (req: Request, res: Response) => {
  try {
    const ticketTypes = Object.values(ticketPriority);
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
  //TODO add created by
  try {
    const { assignedToId, projectId, ...ticketData } = req.body;

    if (assignedToId) {
      try {
        await validateUserRole(assignedToId, "STAFF");
      } catch (validationError: any) {
        return Responses.BadRequest(res, validationError.message);
      }
    }

    // Verify if the provided projectId exists in the database
    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!projectExists) {
      return Responses.BadRequest(
        res,
        "Invalid project ID: Project does not exist."
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        ...ticketData,
        assignedTo: assignedToId
          ? { connect: { id: assignedToId } }
          : undefined,
        project: { connect: { id: projectId } },
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
