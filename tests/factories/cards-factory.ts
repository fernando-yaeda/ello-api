import { faker } from "@faker-js/faker";

import { prisma } from "@/config";
import { Card, List, Project } from "@prisma/client";
import { createList } from "./lists-factory";
import { createProject } from "./projects-factory";

export async function createCard({
  title,
  project,
  list,
}: cardFactoryParams): Promise<Card> {
  const incomingTitle = title || faker.random.words();
  const incomingProject = project || (await createProject());
  const incomingList = list || (await createList({ project: incomingProject }));

  return prisma.card.create({
    data: {
      title: incomingTitle,
      listId: incomingList.id,
    },
  });
}

type cardFactoryParams = {
  title?: string;
  project?: Project;
  list?: List;
};
