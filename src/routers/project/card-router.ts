import { Router } from "express";

import { validateBody } from "@/middlewares";
import { createCardParams } from "@/schemas/card-schema";

import { getCard, postCard } from "@/controllers/card-controller";

const cardsRouter = Router({ mergeParams: true });

cardsRouter.post("/", validateBody(createCardParams), postCard);

cardsRouter.get("/:cardId", getCard);

export { cardsRouter };
