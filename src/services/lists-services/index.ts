import listsRepository, {
  CreateListParams,
} from "@/repositories/lists-repository";
import { List } from "@prisma/client";
import projectService from "../projects-services";
import { listNotFoundError, notAllowedError } from "./errors";

async function createList(
  { name, projectId }: CreateListParams,
  userId: string
): Promise<List | null> {
  const project = await projectService.validateProjectOrFail(projectId);

  if (project.ownerId !== userId) throw notAllowedError();

  return await listsRepository.create({
    name,
    projectId,
  });
}

async function validateListOrFail(listId: string): Promise<List | null> {
  const list = await listsRepository.findById(listId);

  if (!list) throw listNotFoundError();

  return list;
}

const listsServices = {
  createList,
  validateListOrFail,
};

export * from "./errors";
export default listsServices;
