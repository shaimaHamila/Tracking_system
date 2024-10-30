import { Equipment } from "./Equipment";
import { Role } from "./Role";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
  role: Role;
  equipments: Equipment[];
};
