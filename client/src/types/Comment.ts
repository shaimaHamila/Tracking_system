import { RoleId } from "./Role";
import { User } from "./User";

export type Comment = {
  id: number;
  text: string;
  atachedFiles?: string[];
  ticketId: number;
  createdByUserId: RoleId;
  reatedAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdby: User;
};
