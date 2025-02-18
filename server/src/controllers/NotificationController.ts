import { Request, Response } from "express";
import { getCurrentUser } from "../helpers/GetCurrentUser";
import { Responses } from "../helpers/Responses";
import prisma from "../prisma";
import { NotificationType } from "../types/Notification";

interface NotificationProps {
  recipientId: number;
  senderId: number;
  type: NotificationType;
  referenceId: number;
  senderName: string;
  ticketTitle?: string;
  projectTitle?: string;
  role?: string;
}

function buildMessage(
  type: NotificationType,
  senderName: string,
  ticketTitle?: string,
  projectTitle?: string,
  role?: string
): string {
  switch (type) {
    case NotificationType.COMMENT:
      return `${senderName} commented on ticket: "${ticketTitle}"`;
    case NotificationType.TICKET_CREATED:
      return `${senderName} created a new ticket: "${ticketTitle}"`;
    case NotificationType.TICKET_UPDATED:
      return `${senderName} updated the ticket: "${ticketTitle}"`;
    case NotificationType.TICKET_DELETED:
      return `${senderName} deleted the ticket: "${ticketTitle}"`;
    case NotificationType.TICKET_STATUS_CHANGED:
      return `${senderName} changed the status of your ticket: "${ticketTitle}"`;
    case NotificationType.TICKET_ASSIGNED:
      return `${senderName} assigned you to the ticket: "${ticketTitle}"`;
    case NotificationType.PROJECT_ASSIGNED:
    case NotificationType.PROJECT_ASSIGNED:
      if (role === "manager") {
        return `${senderName} Add you to the project as a Manager: "${projectTitle}"`;
      } else if (role === "technical_manager") {
        return `${senderName} Added you to the project as Technical Manager: "${projectTitle}"`;
      } else if (role === "team_member") {
        return `${senderName} Added you to the project team: "${projectTitle}"`;
      }
    default:
      return `${senderName} performed an action`;
  }
}

// Create a dynamic notification message
export const createNotification = async ({
  recipientId,
  senderId,
  type,
  referenceId,
  senderName,
  ticketTitle,
  projectTitle,
  role,
}: NotificationProps) => {
  const message = buildMessage(
    type,
    senderName,
    ticketTitle,
    projectTitle,
    role
  );

  try {
    const notification = await prisma.notification.create({
      data: {
        recipientId,
        senderId,
        type: type,
        referenceId,
        message,
      },
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Notification creation failed");
  }
};

export const getNotifications = async (_req: Request, res: Response) => {
  // Get the current user's ID from the decoded token
  const createdById = res.locals.decodedToken.id;

  let user;
  try {
    user = await getCurrentUser(parseInt(createdById, 10));
  } catch (error: any) {
    return Responses.BadRequest(res, error.message);
  }

  try {
    // Fetch unread notifications where the recipient is the current user and unread is true
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const unseenNotifications = await prisma.notification.count({
      where: {
        recipientId: user.id,
        unread: true,
      },
    });

    const responsePayload = {
      data: notifications,
      meta: {
        unseenNotifications,
      },
    };
    // Send the response back to the client
    return Responses.FetchPagedSucess(res, responsePayload);
  } catch (error) {
    console.error(error);
    return Responses.InternalServerError(
      res,
      "Error fetching unread notifications."
    );
  }
};
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params;

  try {
    if (!notificationId) {
      return Responses.BadRequest(res, "Notification ID is required.");
    }
    const updatedNotification = await prisma.notification.update({
      where: { id: Number(notificationId) },
      data: { unread: false },
    });

    return Responses.UpdateSuccess(res, updatedNotification);
  } catch (error) {
    console.error(error);
    return Responses.InternalServerError(
      res,
      "Error marking notification as read."
    );
  }
};
export const markAllUserNotificationsAsRead = async (
  _req: Request,
  res: Response
) => {
  const currentUserId = res.locals.decodedToken.id;

  // Verify the current user exists and handle errors
  let user;
  try {
    user = await getCurrentUser(parseInt(currentUserId, 10));
  } catch (error: any) {
    return Responses.BadRequest(res, error.message);
  }
  try {
    const updatedNotification = await prisma.notification.updateMany({
      where: { recipientId: Number(user.id), unread: true },
      data: { unread: false },
    });

    return Responses.UpdateSuccess(res, updatedNotification);
  } catch (error) {
    console.error(error);
    return Responses.InternalServerError(
      res,
      "Error marking notification as read."
    );
  }
};
