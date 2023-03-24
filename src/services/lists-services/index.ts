import listsRepository, {
  CreateListParams,
} from "@/repositories/lists-repository";
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

const listsServices = {
  createList,
};

export * from "./errors";
export default listsServices;
