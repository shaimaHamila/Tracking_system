import { Request, Response, NextFunction } from "express";
import { Responses } from "../helpers/Responses";
import { Encrypt } from "../helpers/Encrypt";
import * as jwt from "jsonwebtoken";

export const userAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return Responses.Unauthorized(res);
  }
  const token = header.split(" ")[1];

  try {
    const decodedToken = Encrypt.verifyAccessToken(token);
    res.locals.decodedToken = decodedToken;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return Responses.Unauthorized(res);
    }
    return Responses.BadRequest(res);
  }
};
