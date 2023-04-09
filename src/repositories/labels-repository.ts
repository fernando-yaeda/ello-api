import { prisma } from "@/config";
import { Label } from "@prisma/client";

async function create(data: CreateLabelParams): Promise<Label> {
  return await prisma.label.create({
    data,
  });
}

async function find(id: string) {
  return await prisma.label.findUnique({
    where: { id },
  });
}

export type CreateLabelParams = {
  title: string;
  projectId: string;
  colorName: string;
};

const labelsRepository = {
  create,
  find,
};

export default labelsRepository;
