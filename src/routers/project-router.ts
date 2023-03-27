import { Router } from "express";
import { createProjectSchema } from "@/schemas/project-schema";
import { authenticateToken, validateBody } from "@/middlewares";
import { projectsPost } from "@/controllers/project-controller";

const projectsRouter = Router();

projectsRouter.post(
  "/",
  authenticateToken,
  validateBody(createProjectSchema),
  projectsPost
);

export { projectsRouter };
