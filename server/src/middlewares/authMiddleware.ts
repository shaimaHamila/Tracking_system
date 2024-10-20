import { Request, Response, NextFunction } from "express";
import { Responses } from "../helpers/Responses";
import { Encrypt } from "../helpers/Encrypt";
import * as jwt from "jsonwebtoken";
import { Socket } from "socket.io";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return Responses.Unauthorized(res, "Invalid authorization format.");
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

// Adapted authentication middleware for Socket.IO
export const socketAuthentication = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const header = socket.handshake.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new Error("Invalid authorization format."));
  }

  const token = header.split(" ")[1];

  try {
    const decodedToken = Encrypt.verifyAccessToken(token);
    socket.data.decodedToken = decodedToken;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error("Unauthorized: Invalid token"));
    }
    return next(new Error("Bad Request: Token verification failed"));
  }
};
