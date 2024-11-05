import { Equipment } from "./Equipment";
import { Project } from "./Project";
import { Role } from "./Role";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  role: Role;
  roleId?: number;
  equipments: Partial<Equipment>[];
  projects: Partial<Project>[];
  createdProjects: Partial<Project>[];
  techManagedProjects: Partial<Project>[];
  managedProjects: Partial<Project>[];
  clientProjects: Partial<Project>[];
};
