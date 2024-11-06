import { User } from "./User";

export type Project = {
  id: number;
  name: string;
  description: string;
  projectType: ProjectType;
  createdById: number;
  clientId: number;
  technicalManagerId?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  client: User;
  teamMembers: User[];
  managers: User[];
  technicalManager?: User;
};

export enum ProjectType {
  INTERNAL = "INTERNAL",
  EXTERNAL = "EXTERNAL",
}
