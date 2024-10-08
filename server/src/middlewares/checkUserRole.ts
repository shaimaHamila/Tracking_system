import { Request, Response, NextFunction } from "express";
import { Role } from "../types/Roles";
import { Responses } from "../helpers/Responses";
import { TokenData } from "../helpers/Encrypt";

export const userAuthorization =
  (roles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userToken: TokenData | undefined = res.locals.decodedToken;
      if (!userToken) {
        throw new Error("Invalid token!");
      }
      if (!roles.includes(userToken.role)) {
        return Responses.Forbidden(
          res,
          "You do not have the required permissions."
        );
      }
      next();
    } catch (error: any) {
      return Responses.InternalServerError(res);
    }
  };

// Helper Function to Add Admin Roles
const withAdminRoles = (roles: Role[]): Role[] => {
  return [...roles, "ADMIN", "SUPERADMIN"];
};

// Authorization Middlewares
export const superAdminAuthorization = userAuthorization(["SUPERADMIN"]);
export const adminAuthorization = userAuthorization(["ADMIN"]);

export const adminOrStaffAuthorization = userAuthorization(
  withAdminRoles(["STAFF"])
);
export const adminOrClientAuthorization = userAuthorization(
  withAdminRoles(["CLIENT"])
);
export const adminOrTechnicalManagerAuthorization = userAuthorization(
  withAdminRoles(["TECHNICAL_MANAGER"])
);

// Multi-Role Combinations without Admin and Super Admin
export const staffOrClientAuthorization = userAuthorization([
  "STAFF",
  "CLIENT",
]);
export const staffOrTechnicalManagerAuthorization = userAuthorization([
  "STAFF",
  "TECHNICAL_MANAGER",
]);
export const clientOrTechnicalManagerAuthorization = userAuthorization([
  "CLIENT",
  "TECHNICAL_MANAGER",
]);

// All Possible Roles Combination Excluding Admin and Super Admin
export const allRolesAuthorization = userAuthorization([
  "STAFF",
  "CLIENT",
  "TECHNICAL_MANAGER",
]);
