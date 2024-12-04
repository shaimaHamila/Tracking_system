import { RoleId } from "./Role";
import { User } from "./User";

export type CommentType = {
  id: number;
  text: string;
  atachedFiles?: string[];
  ticketId: number;
  createdByUserId: RoleId;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdby: Partial<User>;
};
