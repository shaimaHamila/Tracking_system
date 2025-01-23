import { Request, Response } from "express";
import prisma from "../prisma";
import { Role } from "../types/Roles";
import { getCurrentUser } from "../helpers/GetCurrentUser";
import { Responses } from "../helpers/Responses";

export const getStats = async (req: Request, res: Response) => {
  // Get the current user's ID from the decoded token
  const currentUserId = res.locals.decodedToken.id;

  if (!currentUserId) {
    return Responses.BadRequest(res, "User ID not found in token.");
  }

  try {
    const user = await getCurrentUser(parseInt(currentUserId, 10));
    const role = user.role.roleName;
    let totalProjects = 0;
    let ticketsOpened = 0;
    let ticketsInProgress = 0;
    let ticketsResolved = 0;
    let ticketsClosed = 0;

    if (role === Role.ADMIN) {
      // Admin: Fetch all projects and tickets
      totalProjects = await prisma.project.count();
      ticketsOpened = await prisma.ticket.count();
      ticketsInProgress = await prisma.ticket.count({
        where: { status: { statusName: "In Progress" } },
      });
      ticketsResolved = await prisma.ticket.count({
        where: { status: { statusName: "Resolved" } },
      });
      ticketsClosed = await prisma.ticket.count({
        where: { status: { statusName: "Closed" } },
      });
    } else if (role === Role.TECHNICAL_MANAGER) {
      // Technical Manager: Fetch tickets where assigned or managed
      const managedProjectIds = await prisma.project
        .findMany({
          where: { technicalManagerId: currentUserId },
          select: { id: true },
        })
        .then((projects) => projects.map((project) => project.id));

      ticketsOpened = await prisma.ticket.count({
        where: {
          OR: [
            { projectId: { in: managedProjectIds } },
            { assignedUsers: { some: { userId: currentUserId } } },
          ],
        },
      });
    } else if (role === Role.CLIENT) {
      // Client: Fetch projects assigned as a client and related tickets
      const clientProjects = await prisma.project
        .findMany({
          where: { clientId: currentUserId },
          select: { id: true },
        })
        .then((projects) => projects.map((project) => project.id));

      totalProjects = clientProjects.length;
      ticketsOpened = await prisma.ticket.count({
        where: { projectId: { in: clientProjects } },
      });
    } else if (role === Role.STAFF) {
      // Staff: Fetch projects they are team members or managers and related tickets
      const staffProjects = await prisma.project
        .findMany({
          where: {
            OR: [
              { teamMembers: { some: { teamMemberId: currentUserId } } },
              { managers: { some: { managerId: currentUserId } } },
            ],
          },
          select: { id: true },
        })
        .then((projects) => projects.map((project) => project.id));

      totalProjects = staffProjects.length;
      ticketsOpened = await prisma.ticket.count({
        where: {
          OR: [
            { projectId: { in: staffProjects } },
            { assignedUsers: { some: { userId: currentUserId } } },
          ],
        },
      });
    }

    // Construct the response payload
    const responsePayload = {
      totalProjects,
      tickets: {
        opened: ticketsOpened,
        inProgress: ticketsInProgress,
        resolved: ticketsResolved,
        closed: ticketsClosed,
      },
    };

    return Responses.FetchSucess(res, responsePayload);
  } catch (error: any) {
    return Responses.InternalServerError(
      res,
      `Error fetching stats: ${error.message}`
    );
  }
};
