import { prisma } from "@/config";
import { List } from "@prisma/client";

async function create(data: CreateListParams): Promise<List> {
  return await prisma.list.create({
    data,
  });
}

async function findById(listId: string): Promise<List> {
  return await prisma.list.findUnique({
    where: {
      id: listId,
    },
  });
}

export type CreateListParams = {
  name: string;
  projectId: string;
};

const listsRepository = {
  create,
  findById,
};

export default listsRepository;
