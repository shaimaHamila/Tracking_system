import { Request, Response, NextFunction } from "express";
import { Role, RoleType } from "../types/Roles";
import { Responses } from "../helpers/Responses";
import { TokenData } from "../helpers/Encrypt";

export const userAuthorization =
  (roles: RoleType[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userToken: TokenData | undefined = res.locals.decodedToken;
      console.log(
        "userTokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
        userToken
      );
      if (!userToken) {
        throw new Error("Invalid token!");
      }
      console.log(
        "!roles.includes(userToken.role)",
        roles,
        userToken.role,
        !roles.includes(userToken.role)
      );
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

// Authorization Middlewares
export const superAdminAuthorization = userAuthorization([Role.SUPERADMIN]);
export const adminAuthorization = userAuthorization([Role.ADMIN]);
export const allRoleAuthorization = userAuthorization([
  Role.ADMIN,
  Role.STAFF,
  Role.CLIENT,
  Role.TECHNICAL_MANAGER,
  Role.SUPERADMIN,
]);
