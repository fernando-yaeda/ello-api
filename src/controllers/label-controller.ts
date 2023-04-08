import httpStatus from "http-status";

import { AuthenticatedRequest } from "@/middlewares";
import { NextFunction, Response } from "express";

import labelServices from "@/services/label-services";

export async function labelPost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response> {
  const projectId = req.params.projectId;
  const { title, colorName } = req.body;

  try {
    const label = await labelServices.createLabel({
      title,
      projectId,
      colorName,
    });

    return res.status(httpStatus.CREATED).json({
      labelId: label.id,
      title: label.title,
      colorName: label.colorName,
    });
  } catch (error) {
    if (error.name === "ColorNotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    next(error);
  }
}
