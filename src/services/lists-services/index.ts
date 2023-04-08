import { ApplicationError } from "@/protocols";

import listsRepository, {
  CreateListParams,
} from "@/repositories/lists-repository";
import { listNotFoundError } from "./errors";
import { List } from "@prisma/client";

async function createList({
  name,
  projectId,
}: CreateListParams): Promise<List> {
  return await listsRepository.create({
    name,
    projectId,
  });
}

async function getById(listId: string): Promise<List | ApplicationError> {
  const list = await listsRepository.findById(listId);

  if (!list) throw listNotFoundError();

  return list;
}

const listsServices = {
  createList,
  getById,
};

export * from "./errors";
export default listsServices;
