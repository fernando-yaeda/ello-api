import projectService from "../projects-services";
import participantServices from "../participant-services";
import colorServices from "../color-services";

import labelsRepository, {
  CreateLabelParams,
} from "@/repositories/labels-repository";
import { Label } from "@prisma/client";

async function createLabel(
  createLabelData: CreateLabelParams,
  userId: string
): Promise<Label> {
  await projectService.validateProjectOrFail(createLabelData.projectId);
  await participantServices.validateParticipant(
    userId,
    createLabelData.projectId
  );

  await colorServices.getByName(createLabelData.colorName);

  const label = await labelsRepository.create(createLabelData);

  return label;
}

const labelServices = {
  createLabel,
};

export default labelServices;
