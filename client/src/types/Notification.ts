import { User } from "./User";

export type Notification = {
  id: number;
  recipientId: number;
  senderId: number;
  unread: number;
  unseenNotifications: number;
  type: NotificationType;
  message?: string;
  createdAt: string;
  referenceId: any;
  recipient: User;
  sender: User;
};

export enum NotificationType {
  COMMENT = "COMMENT",
  TICKET_CREATED = "TICKET_CREATED",
  TICKET_UPDATED = "TICKET_UPDATED",
  TICKET_DELETED = "TICKET_DELETED",
  TICKET_STATUS_CHANGED = "TICKET_STATUS_CHANGED",
  TICKET_ASSIGNED = "TICKET_ASSIGNED",
  PROJECT_ASSIGNED = "PROJECT_ASSIGNED",
  OTHER = "OTHER",
}
