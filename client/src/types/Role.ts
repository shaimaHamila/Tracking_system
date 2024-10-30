export type Role = {
  id: RoleId;
  roleName: string;
};
export type RoleType = "SUPERADMIN" | "ADMIN" | "STAFF" | "CLIENT" | "TECHNICAL_MANAGER";

export enum RoleName {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CLIENT = "CLIENT",
  TECHNICAL_MANAGER = "TECHNICAL_MANAGER",
}
// SUPERADMIN: 1, ADMIN: 2, STAFF: 3, CLIENT: 4, TECHNICAL_MANAGER: 5
export type RoleId = 1 | 2 | 3 | 4 | 5;
