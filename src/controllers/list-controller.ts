import { AuthenticatedRequest } from "@/middlewares";
import listsServices from "@/services/lists-services";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function listsPost(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response> {
  const { name } = req.body;
  const projectId = req.params.projectId;

  try {
    const list = await listsServices.createList({ name, projectId });

    return res.status(httpStatus.CREATED).json({
      listId: list.id,
      name: list.name,
    });
  } catch (error) {
    next(error);
  }
}
