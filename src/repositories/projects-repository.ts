import { prisma } from "@/config";
import { Project } from "@prisma/client";

async function create(data: CreateProjectParams): Promise<Project> {
  return await prisma.project.create({
    data,
  });
}

async function findById(projectId: string): Promise<Project | null> {
  return await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
}

export type CreateProjectParams = Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>;

const projectsRepository = {
  create,
  findById,
};

export default projectsRepository;
