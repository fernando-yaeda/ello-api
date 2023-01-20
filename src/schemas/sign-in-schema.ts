import { SignInParams } from "@/services/authentication-services.ts";
import Joi from "joi";

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(18).required(),
});
