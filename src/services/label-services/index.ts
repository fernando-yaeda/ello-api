import colorServices from "../color-services";

import labelsRepository, {
  CreateLabelParams,
} from "@/repositories/labels-repository";
import { Label } from "@prisma/client";

async function createLabel(createLabelData: CreateLabelParams): Promise<Label> {
  await colorServices.getByName(createLabelData.colorName);

  const label = await labelsRepository.create(createLabelData);

  return label;
}

const labelServices = {
  createLabel,
};

export default labelServices;
