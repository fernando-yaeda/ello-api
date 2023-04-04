import { Router } from "express";

import { authenticateToken, validateBody } from "@/middlewares";
import { createLabelSchema } from "@/schemas/label-schema";

import { labelPost } from "@/controllers/label-controller";

const labelsRouter = Router();

labelsRouter.post(
  "/",
  authenticateToken,
  validateBody(createLabelSchema),
  labelPost
);

export { labelsRouter };
