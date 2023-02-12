import authenticationServices from "@/services/authentication-services";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function signInPost(
  req: Request,
  res: Response
): Promise<Response> {
  const { email, password } = req.body;

  try {
    const result = await authenticationServices.signIn({ email, password });

    return res.status(httpStatus.OK).json(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send(error);
  }
}
