import { unauthorizedError } from "@/errors/unauthorized-error";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import authenticationServices from "@/services/authentication-services";
import { ApplicationError } from "@/protocols";

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) return unauthorizedResponse(res);

  const token = authorizationHeader.split(" ")[1];

  if (!token) return unauthorizedResponse(res);

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    const session = await authenticationServices.findSession(token);

    if (!session) {
      return unauthorizedResponse(res);
    }

    res.locals.userId = userId;

    next();
  } catch (error) {
    return unauthorizedResponse(res);
  }
}

function unauthorizedResponse(res: Response): Response {
  return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
}

export type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  userId: string;
};
