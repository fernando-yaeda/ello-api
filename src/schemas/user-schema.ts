import { CreateUserParams } from "@/services/user-services";
import Joi from "joi";

export const createUserSchema = Joi.object<CreateUserParams>({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).max(18).required(),
});
