import httpStatus from "http-status";

import { AuthenticatedRequest } from "@/middlewares";
import { NextFunction, Response } from "express";

import labelServices from "@/services/label-services";

export async function labelPost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response> {
  const userId = res.locals.userId;
  const { title, projectId, colorName } = req.body;

  try {
    const label = await labelServices.createLabel(
      { title, projectId, colorName },
      userId
    );

    return res.status(httpStatus.CREATED).json({
      labelId: label.id,
      title: label.title,
      colorName: label.colorName,
    });
  } catch (error) {
    if (error.name === "ColorNotFoundError") {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
    next(error);
  }
}
