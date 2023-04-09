import Joi from "joi";

import { CreateLabelParams } from "@/repositories/labels-repository";

export const createLabelSchema = Joi.object<CreateLabelParams>({
  title: Joi.string().required(),
  colorName: Joi.string().required(),
});
