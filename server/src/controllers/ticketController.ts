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
import { createNotification } from "./NotificationController";
import { NotificationType } from "../types/Notification";
import chalk from "chalk";

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
          user.role.roleName == Role.STAFF ||
          user.role.roleName == Role.TECHNICAL_MANAGER) &&
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
        return Responses.BadRequest(
          res,
          "Bad Request you dont have the prmession to create a ticket."
        );
      }

      //statusId and priority if not exist then set default values
      const ticket = await prisma.ticket.create({
        data: {
          ...ticketData,
          project: { connect: { id: projectId } },
          ...(equipmentId && {
            equipment: {
              connect: { id: equipmentId },
            },
          }),
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
          status: true,
          equipment: true,
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
      });

      const ticketTitle = ticket.title;
      const projectTitle = ticket.project.name;

      // Notify assigned users
      ticket.assignedUsers.forEach(({ user: assignedUser }) => {
        if (assignedUser.id !== user.id) {
          createNotification({
            recipientId: assignedUser.id,
            senderId: user.id,
            type: NotificationType.TICKET_CREATED,
            referenceId: ticket.id,
            senderName: `${ticket?.createdBy?.firstName} ${ticket?.createdBy?.lastName}`,
            ticketTitle,
            projectTitle,
          }).then((notification) => {
            io.to(assignedUser.id.toString()).emit(
              "newNotification",
              notification
            );
            console.log(
              chalk.green(
                "senddddddddddddddddddddddddddddddddddddddddddd io notification",
                notification
              )
            );
          });
        }
      });

      const transformedCreatedTicket = {
        ...ticket,
        assignedUsers: ticket.assignedUsers.map(({ user }) => user), // Flatten user details
        assignedUsersId: ticket.assignedUsers.map(({ user }) => user.id), // Extract user IDs
        managersId: ticket.project.managers.map(({ manager }) => manager.id), // Extract manager IDs
      };

      // Emit the ticketCreated event to all users in the "tickets" room
      return Responses.CreateSuccess(res, transformedCreatedTicket);
    } catch (error) {
      return Responses.InternalServerError(res, "Internal server error.");
    }
  };

//Update ticket
export const updateTicket =
  (io: any) => async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return Responses.BadRequest(res, "Ticket ID is required.");

    const { title, description, type, priority, statusId, assignedUsersId } =
      req.body;

    try {
      const userId = res.locals.decodedToken.id; // Get user ID from token
      const user = await getCurrentUser(userId);

      // Fetch the ticket
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(id) },
        include: {
          assignedUsers: {
            select: { userId: true },
          },
        },
      });

      if (!ticket) return Responses.NotFound(res, "Ticket not found.");

      // Build update data dynamically
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (type) updateData.type = type;
      if (priority) updateData.priority = priority;
      if (statusId) updateData.status = { connect: { id: statusId } };

      if (assignedUsersId && Array.isArray(assignedUsersId)) {
        if (assignedUsersId.length === 0) {
          return Responses.BadRequest(
            res,
            "The ticket must be assigned to at least one user."
          );
        }

        // Update assigned users
        const newAssignedUsers = await updateTicketAssignedUsers(
          ticket.id,
          assignedUsersId,
          ticket.assignedUsers
        );
        if (newAssignedUsers) {
          const ticketAssignedUsersUpdate = await prisma.ticket.findUnique({
            where: { id: Number(id) },
            include: {
              project: {
                select: {
                  id: true,
                  name: true,
                },
              },
              assignedUsers: {
                select: {
                  user: {
                    select: {
                      id: true,
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
                },
              },
            },
          });
          // Notify assigned users
          ticketAssignedUsersUpdate?.assignedUsers.forEach(
            ({ user: assignedUser }) => {
              if (assignedUser.id !== user.id) {
                createNotification({
                  recipientId: assignedUser.id,
                  senderId: user.id,
                  type: NotificationType.TICKET_ASSIGNED,
                  referenceId: ticketAssignedUsersUpdate?.id,
                  senderName: `${ticketAssignedUsersUpdate?.createdBy?.firstName} ${ticketAssignedUsersUpdate?.createdBy?.lastName}`,
                  ticketTitle: ticketAssignedUsersUpdate?.title,
                  projectTitle: ticketAssignedUsersUpdate?.project?.name,
                });
              }
            }
          );
        }
      }

      // Apply updates to the ticket
      const updatedTicket = await prisma.ticket.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          status: true,
          equipment: true,
          project: {
            select: {
              id: true,
              name: true,
              projectType: true,
              clientId: true,
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
      });
      const transformedupdatedTicket = {
        ...updatedTicket,
        assignedUsers: updatedTicket.assignedUsers.map(({ user }) => user), // Flatten user details
        assignedUsersId: updatedTicket.assignedUsers.map(({ user }) => user.id), // Extract user IDs
        managersId: updatedTicket.project.managers.map(
          ({ manager }) => manager.id
        ), // Extract manager IDs
      };
      if (statusId) {
        // Notify assigned users
        updatedTicket?.assignedUsers.forEach(({ user: assignedUser }) => {
          if (assignedUser.id !== user.id) {
            createNotification({
              recipientId: assignedUser.id,
              senderId: user.id,
              type: NotificationType.TICKET_STATUS_CHANGED,
              referenceId: updatedTicket?.id,
              senderName: `${updatedTicket?.createdBy?.firstName} ${updatedTicket?.createdBy?.lastName}`,
              ticketTitle: updatedTicket?.title,
              projectTitle: updatedTicket?.project?.name,
            });
          }
        });
        if (
          updatedTicket?.project?.clientId &&
          updatedTicket?.project?.projectType == ProjectType.EXTERNAL
        ) {
          createNotification({
            recipientId: updatedTicket?.project?.clientId,
            senderId: user.id,
            type: NotificationType.TICKET_STATUS_CHANGED,
            referenceId: updatedTicket?.id,
            senderName: `${updatedTicket?.createdBy?.firstName} ${updatedTicket?.createdBy?.lastName}`,
            ticketTitle: updatedTicket?.title,
            projectTitle: updatedTicket?.project?.name,
          });
        }
      }
      return Responses.UpdateSuccess(res, transformedupdatedTicket);
    } catch (error) {
      return Responses.InternalServerError(res, "Internal server error.");
    }
  };

// Helper to update assigned users
const updateTicketAssignedUsers = async (
  ticketId: number,
  assignedUsersId: number[],
  oldAssignedUsers: any
) => {
  const existingAssignedUsersIds = oldAssignedUsers.map(
    (user: any) => user.userId
  );

  const usersToDelete = existingAssignedUsersIds.filter(
    (userId: number) => !assignedUsersId.includes(userId)
  );

  const usersToAdd = assignedUsersId.filter(
    (userId: number) => !existingAssignedUsersIds.includes(userId)
  );

  if (usersToDelete.length) {
    await prisma.user_ticket.deleteMany({
      where: {
        ticketId,
        userId: { in: usersToDelete },
      },
    });
  }

  if (usersToAdd.length) {
    await prisma.user_ticket.createMany({
      data: usersToAdd.map((userId: number) => ({
        ticketId,
        userId,
      })),
    });
    return usersToAdd;
  }
};

// Get all tickets :
// by project type | by creator | by status | by priority | by type | by assigned user | by project
// they are all optinal
// with pagination
//who can see all the tickets?
// If Admin : can see all tickets
// If PM : can see all tickets of his projects
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
      ...(user.role.roleName != Role.TECHNICAL_MANAGER &&
        projectType && { project: { projectType } }),
      ...(user.role.roleName == Role.TECHNICAL_MANAGER &&
        projectType && { project: { projectType: "INTERNAL" } }),
      ...(user.role.roleName != Role.ADMIN &&
        user.role.roleName != Role.CLIENT &&
        assignedUserId && {
          OR: [
            {
              assignedUsers: { some: { userId: parseInt(assignedUserId, 10) } },
            },
            { createdById: user.id }, // Also return tickets created by the user
          ],
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
          equipment: true,
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
const applyRoleBasedFilter = async (
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
        projectType: ProjectType.INTERNAL,
      };
      break;
    case Role.STAFF:
      // Staff can see tickets assigned to them or created by them
      whereClause.OR = [
        { createdById: userId },
        { assignedUsers: { some: { userId: userId } } },
      ];

      // Check if the user is a manager of any project
      const managedProjectIds = await prisma.project_manager.findMany({
        where: { managerId: userId },
        select: { projectId: true },
      });

      if (managedProjectIds.length > 0) {
        const projectIds = managedProjectIds.map((p) => p.projectId);
        whereClause.OR.push({ projectId: { in: projectIds } });
      }
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
        equipment: true,
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
    });

    if (!ticket) {
      return Responses.NotFound(res, "Ticket not found");
    }
    const transformedTicket = {
      ...ticket,
      assignedUsers: ticket.assignedUsers.map(({ user }) => user), // Flatten user details
      assignedUsersId: ticket.assignedUsers.map(({ user }) => user.id), // Extract user IDs
      managersId: ticket.project.managers.map(({ manager }) => manager.id), // Extract manager IDs
    };
    return Responses.OperationSuccess(res, transformedTicket);
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
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUsers: {
            select: {
              user: {
                select: {
                  id: true,
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
            },
          },
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
      // Notify assigned users
      ticket.assignedUsers.forEach(({ user: assignedUser }) => {
        if (assignedUser.id !== user.id) {
          createNotification({
            recipientId: assignedUser.id,
            senderId: user.id,
            type: NotificationType.TICKET_DELETED,
            referenceId: ticket?.id,
            senderName: `${ticket?.createdBy?.firstName} ${ticket?.createdBy?.lastName}`,
            ticketTitle: ticket?.title,
            projectTitle: ticket?.project?.name,
          });
        }
      });
      return Responses.DeleteSuccess(res);
    } catch (error) {
      return Responses.InternalServerError(res, "Error deleting ticket");
    }
  };
