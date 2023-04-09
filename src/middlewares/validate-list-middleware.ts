import httpStatus from "http-status";
import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "./authentication-middleware";
import listsServices, { listNotFoundError } from "@/services/lists-services";

export async function validateListMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const listId = req.params.listId;

  try {
    await listsServices.getById(listId);

    next();
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send(listNotFoundError());
  }
}
