import { faker } from "@faker-js/faker";

import { prisma } from "@/config";
import { Color } from "@prisma/client";

export async function createColor(
  name?: string,
  color?: string
): Promise<Color> {
  return prisma.color.create({
    data: {
      name: name || faker.random.words(),
      color: color || faker.color.rgb({ format: "css" }),
    },
  });
}
