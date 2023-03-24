import { prisma } from "@/config";
import { Project } from "@prisma/client";

async function create(data: CreateProjectParams): Promise<Project> {
  return await prisma.project.create({
    data,
  });
}

export type CreateProjectParams = Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>;

const projectsRepository = {
  create,
};

export default projectsRepository;
