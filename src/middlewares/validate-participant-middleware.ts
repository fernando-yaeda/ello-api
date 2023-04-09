import httpStatus from "http-status";
import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "./authentication-middleware";
import participantServices from "@/services/participant-services";
import { notParticipantError } from "@/errors/not-participant-error";

export async function validateParticipantMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = res.locals.userId;
  const projectId = req.params.projectId;

  try {
    await participantServices.validateParticipant(userId, projectId);

    next();
  } catch (error) {
    res.status(httpStatus.FORBIDDEN).send(notParticipantError());
  }
}
