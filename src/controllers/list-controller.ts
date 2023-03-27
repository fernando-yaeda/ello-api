import { AuthenticatedRequest } from "@/middlewares";
import listsServices from "@/services/lists-services";
import { Response } from "express";
import httpStatus from "http-status";

export async function listsPost(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  const userId = res.locals.userId;
  const { name, projectId } = req.body;

  try {
    const list = await listsServices.createList({ name, projectId }, userId);

    return res.status(httpStatus.CREATED).json({
      listId: list.id,
      name: list.name,
    });
  } catch (error) {
    if (error.name === "InvalidDataError") {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.name === "NotAllowedError") {
      return res.status(httpStatus.FORBIDDEN).send(error);
    }

    if (error.name === "ProjectNotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
  }
}
