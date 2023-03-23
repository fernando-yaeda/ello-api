import userService from "@/services/user-services";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function usersPost(
  req: Request,
  res: Response
): Promise<Response> {
  const { email, username, password } = req.body;

  try {
    const user = await userService.createUser({ email, username, password });

    return res.status(httpStatus.CREATED).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
