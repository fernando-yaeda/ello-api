import authenticationServices from "@/services/authentication-services";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export async function signInPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  const { email, password } = req.body;

  try {
    const result = await authenticationServices.signIn({ email, password });

    return res.status(httpStatus.OK).json(result);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    if (error.name === "InvalidCredentialsError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    next(error);
  }
}
