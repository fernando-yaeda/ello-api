import { faker } from "@faker-js/faker";

import { prisma } from "@/config";
import { Project, User } from "@prisma/client";
import { createUser } from "./";

export async function createProject(user?: User): Promise<Project> {
  const incomingUser = user || (await createUser());

  return await prisma.project.create({
    data: {
      name: faker.random.words(),
      ownerId: incomingUser.id,

      participants: {
        create: {
          isAdmin: true,
          userId: incomingUser.id,
        },
      },
    },
  });
}
