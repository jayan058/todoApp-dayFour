import { findUserByEmail } from "../models/users";
import jwt from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import { Response } from "express";
import NotFoundError from "../error/notFoundError";
import UnauthorizedError from "../error/unauthorizedError";
const { sign } = jwt;
const bcrypt = require("bcrypt");
import config from "../config";
import ForbiddenError from "../error/forbiddenError";
import { StatusCodes } from "http-status-codes";

let refreshTokens: string[] = [];
export async function login(email: string, password: string, res: Response) {
  const userExists = findUserByEmail(email);
  if (!userExists) {
    throw new NotFoundError("No Matching Email");
  }
  const match = await bcrypt.compare(password, userExists.password);
  if (!match) {
    throw new UnauthorizedError("Passwords Don't Match");
  }
  const payload = {
    id: userExists.id,
    name: userExists.name,
    email: userExists.email,
    permission: userExists.permission,
  };
  const accessToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });
  const refreshToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });
  refreshTokens.push(refreshToken);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(StatusCodes.OK).json({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
}
export function generateAccessToken(payload: object) {
  return sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });
}
export function verifyRefreshToken(token: string) {
  return new Promise((resolve, reject) => {
    verify(token, config.jwt.jwt_secret!, (err, user) => {
      if (err) return reject(new ForbiddenError("Invalid refresh token"));
      resolve(user);
    });
  });
}
export function isRefreshTokenValid(token: string) {
  if (!refreshTokens.includes(token)) {
    throw new ForbiddenError("Invalid refresh token");
  }
  return true;
}
