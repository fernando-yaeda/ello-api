import { CreateCardParams } from "@/repositories/cards-repository";
import Joi from "joi";

export const createCardParams = Joi.object<CreateCardParams>({
  title: Joi.string().required(),
});
