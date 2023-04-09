import { AuthenticatedRequest } from "@/middlewares";
import cardServices from "@/services/cards-services";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function postCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response> {
  const userId = res.locals.userId;
  const listId = req.params.listId;
  const { title } = req.body;

  try {
    const card = await cardServices.createCard(
      {
        title,
        listId,
      },
      userId
    );

    return res.status(httpStatus.CREATED).json({
      cardId: card.id,
      title: card.title,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response> {
  const cardId = req.params.cardId;

  try {
    const card = await cardServices.getById(cardId);

    return res.status(httpStatus.OK).json(card);
  } catch (error) {
    if (error.name === "CardNotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }

    next(error);
  }
}
