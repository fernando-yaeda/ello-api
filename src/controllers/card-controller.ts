import { AuthenticatedRequest } from "@/middlewares";
import cardServices from "@/services/cards-services";
import { Response } from "express";
import httpStatus from "http-status";

export async function cardsPost(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  const userId = res.locals.userId;
  const { title, listId } = req.body;

  try {
    const card = await cardServices.createCard({ title, listId }, userId);

    return res.status(httpStatus.CREATED).json({
      cardId: card.id,
      name: card.title,
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

    if (error.name === "ProjectNotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name === "ListNotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
  }
}