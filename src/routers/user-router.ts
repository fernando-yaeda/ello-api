import { Router } from "express";

import { createUserSchema } from "@/schemas/user-schema";
import { usersPost } from "@/controllers/user-controller";
import { validateBody } from "@/middlewares";

const usersRouter = Router();

usersRouter.post("/", validateBody(createUserSchema), usersPost);

export { usersRouter };
