import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import ms from "ms";
import { RoleType } from "../types/Roles";
dotenv.config();

export interface TokenData {
  id: number;
  role: RoleType;
}

export class Encrypt {
  static async encryptpass(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  static comparepassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(tokenData: TokenData) {
    if (!process.env.JWT_TOKEN_SECRET)
      throw new Error("TOKEN_SECRET is undefined");
    return jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXP_IN,
    });
  }

  static verifyToken(key: jwt.Secret, token: string) {
    if (!token) {
      throw new jwt.JsonWebTokenError("Invalid token.");
    }
    if (!key) throw new Error("TOKEN_SECRET is undefined");
    return jwt.verify(token, key) as jwt.JwtPayload;
  }

  static verifyAccessToken = (token: string) =>
    Encrypt.verifyToken(process.env.JWT_TOKEN_SECRET!, token);

  static verifyRefreshToken = (token: string) =>
    Encrypt.verifyToken(process.env.JWT_REFRESH_TOKEN_SECRET!, token);

  static generateRefreshToken(tokenData: TokenData) {
    if (!process.env.JWT_REFRESH_TOKEN_SECRET)
      throw new Error("REFRESH_TOKEN_SECRET is undefined");
    return jwt.sign(tokenData, process.env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXP_IN,
    });
  }

  static getEstimatedAccessTokenExp = () =>
    new Date(Date.now() + ms(process.env.JWT_EXP_IN!));

  static getEstimatedRefreshTokenExp = () =>
    new Date(Date.now() + ms(process.env.JWT_REFRESH_EXP_IN!));
}
