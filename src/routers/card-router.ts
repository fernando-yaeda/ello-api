import { Router } from "express";
import { createCardParams } from "@/schemas/card-schema";
import { authenticateToken, validateBody } from "@/middlewares";
import { cardsPost } from "@/controllers/card-controller";

const cardsRouter = Router();

cardsRouter.post(
  "/",
  authenticateToken,
  validateBody(createCardParams),
  cardsPost
);

export { cardsRouter };
