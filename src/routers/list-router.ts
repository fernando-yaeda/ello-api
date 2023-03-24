import { Router } from "express";
import { createListParams } from "@/schemas/list-schema";
import { authenticateToken, validateBody } from "@/middlewares";
import { listsPost } from "@/controllers/list-controller";

const listsRouter = Router();

listsRouter.post(
  "/",
  authenticateToken,
  validateBody(createListParams),
  listsPost
);

export { listsRouter };
