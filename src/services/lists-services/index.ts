import projectService from "../projects-services";
import participantServices from "../participant-services";

import listsRepository, {
  CreateListParams,
} from "@/repositories/lists-repository";
import { listNotFoundError } from "./errors";
import { List } from "@prisma/client";

async function createList(
  { name, projectId }: CreateListParams,
  userId: string
): Promise<List> {
  await projectService.validateProjectOrFail(projectId);
  await participantServices.validateParticipant(userId, projectId);

  return await listsRepository.create({
    name,
    projectId,
  });
}

async function validateListOrFail(projectId: string): Promise<List | never> {
  const list = await listsRepository.findById(projectId);

  if (!list) throw listNotFoundError();

  return list;
}

async function getListById(listId: string): Promise<List> {
  const list = await listsRepository.findById(listId);

  return list;
}

const listsServices = {
  createList,
  getListById,
  validateListOrFail,
};

export * from "./errors";
export default listsServices;
