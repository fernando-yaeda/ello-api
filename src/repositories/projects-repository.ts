import { prisma } from "@/config";
import { Project, Participant } from "@prisma/client";

async function create(createData: CreateProjectParams): Promise<
  Project & {
    participants: Participant[];
  }
> {
  return await prisma.project.create({
    data: {
      name: createData.name,
      ownerId: createData.ownerId,

      participants: {
        create: {
          isAdmin: true,
          userId: createData.ownerId,
        },
      },
    },

    include: {
      participants: true,
    },
  });
}

async function findById(projectId: string): Promise<Project> {
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
