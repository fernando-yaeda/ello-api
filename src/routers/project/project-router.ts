import { Router } from "express";

import { authenticateToken, validateBody } from "@/middlewares";
import { validateProjectMiddleware } from "@/middlewares/validate-project-middleware";
import { validateParticipantMiddleware } from "@/middlewares/validate-participant-middleware";
import { createProjectSchema } from "@/schemas/project-schema";

import { listsRouter } from "./list-router";
import { labelsRouter } from "./label-router";

import { projectsPost } from "@/controllers/project-controller";

const projectsRouter = Router({ mergeParams: true });

projectsRouter.use(authenticateToken);
projectsRouter.post("/", validateBody(createProjectSchema), projectsPost);

projectsRouter.use(
  "/:projectId/lists",
  validateProjectMiddleware,
  validateParticipantMiddleware,
  listsRouter
);

projectsRouter.use(
  "/:projectId/labels",
  validateProjectMiddleware,
  validateParticipantMiddleware,
  labelsRouter
);

export { projectsRouter };
