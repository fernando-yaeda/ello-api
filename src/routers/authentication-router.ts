import { Router } from "express";

import { signInSchema } from "@/schemas/sign-in-schema";
import { signInPost } from "@/controllers/authentication-controller";
import { validateBody } from "@/middlewares";

const authenticationRouter = Router();

authenticationRouter.post("/sign-in", validateBody(signInSchema), signInPost);

export { authenticationRouter };
