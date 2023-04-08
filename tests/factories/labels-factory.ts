import { faker } from "@faker-js/faker";

import { prisma } from "@/config";
import { Color, Label, Project } from "@prisma/client";
import { createProject } from "./projects-factory";
import { createColor } from "./colors-factory";

export async function createLabel({
  title,
  project,
  color,
}: labelFactoryParams): Promise<Label> {
  const incomingTitle = title || faker.random.words();
  const incomingProject = project || (await createProject());
  const incomingColor = color || (await createColor());

  return prisma.label.create({
    data: {
      title: incomingTitle,
      projectId: incomingProject.id,
      colorName: incomingColor.name,
    },
  });
}

type labelFactoryParams = {
  title?: string;
  project?: Project;
  color?: Color;
};
