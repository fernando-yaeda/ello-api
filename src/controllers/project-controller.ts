import { AuthenticatedRequest } from "@/middlewares";
import projectService from "@/services/projects-services";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function projectsPost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response> {
  const ownerId = res.locals.userId;
  const { name } = req.body;

  try {
    const project = await projectService.createProject({ name, ownerId });

    return res.status(httpStatus.CREATED).json({
      projectId: project.id,
      name: project.name,
      ownerId: project.ownerId,
    });
  } catch (error) {
    next(error);
  }
}
