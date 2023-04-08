import { List, Project, User } from "@prisma/client";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import { createUser } from "./users-factory";
import { createProject } from "./projects-factory";

export async function createList({
  user,
  project,
}: listFactoryParams): Promise<List> {
  const incomingUser = user || (await createUser());
  const incomingProject = project || (await createProject(incomingUser));

  return prisma.list.create({
    data: {
      name: faker.random.words(),
      projectId: incomingProject.id,
    },
  });
}

type listFactoryParams = {
  user?: User;
  project?: Project;
};
