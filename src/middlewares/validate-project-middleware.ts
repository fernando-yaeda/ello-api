import httpStatus from "http-status";
import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "./authentication-middleware";
import projectService, {
  projectNotFoundError,
} from "@/services/projects-services";

export async function validateProjectMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = req.params.projectId;

  try {
    await projectService.getById(projectId);

    next();
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send(projectNotFoundError());
  }
}
