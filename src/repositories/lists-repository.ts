import { prisma } from "@/config";
import { List } from "@prisma/client";

async function create(data: CreateListParams): Promise<List> {
  return await prisma.list.create({
    data,
  });
}

export type CreateListParams = {
  name: string;
  projectId: string;
};

const listsRepository = {
  create,
};

export default listsRepository;
