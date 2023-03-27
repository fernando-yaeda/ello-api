import { CreateProjectParams } from "@/repositories/projects-repository";
import Joi from "joi";

export const createProjectSchema = Joi.object<CreateProjectParams>({
  name: Joi.string().required(),
});
