import { Project } from "./Project";
import { User } from "./User";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  type: TicketType;
  statusId: number;
  priority: TicketPriority;
  createdById: number;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  status: TicketStatusType;
  project: Project;
  assignedUsers: User[];
  createdBy: User;
};

export type TicketStatusType = {
  id: number;
  statusName: string;
};
export enum TicketStatusId {
  OPEN = 1,
  IN_PROGRESS = 2,
  RESOLVED = 3,
  CLOSED = 4,
}
export enum TicketStatusName {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}
export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum TicketType {
  BUG = "BUG",
  FEATURE = "FEATURE",
  CONSULTATION = "CONSULTATION",
  REQUEST = "REQUEST",
}
