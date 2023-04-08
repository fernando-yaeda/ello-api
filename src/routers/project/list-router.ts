import { Router } from "express";

import { validateBody } from "@/middlewares";
import { validateListMiddleware } from "@/middlewares/validate-list-middleware";
import { createListParams } from "@/schemas/list-schema";

import { listsPost } from "@/controllers/list-controller";
import { cardsRouter } from "./card-router";

const listsRouter = Router({ mergeParams: true });

listsRouter.post("/", validateBody(createListParams), listsPost);

listsRouter.use("/:listId/cards", validateListMiddleware, cardsRouter);

export { listsRouter };
