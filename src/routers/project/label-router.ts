import { Router } from "express";

import { validateBody } from "@/middlewares";
import { createLabelSchema } from "@/schemas/label-schema";

import { labelPost } from "@/controllers/label-controller";

const labelsRouter = Router({ mergeParams: true });

labelsRouter.post("/", validateBody(createLabelSchema), labelPost);

export { labelsRouter };
