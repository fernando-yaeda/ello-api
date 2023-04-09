import { CreateListParams } from "@/repositories/lists-repository";
import Joi from "joi";

export const createListParams = Joi.object<CreateListParams>({
  name: Joi.string().required(),
});
