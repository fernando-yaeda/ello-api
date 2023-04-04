import { prisma } from "@/config";
import { Color } from "@prisma/client";

async function findByName(colorName: string): Promise<Color> {
  return await prisma.color.findUnique({
    where: {
      name: colorName,
    },
  });
}

const colorsRepository = {
  findByName,
};

export default colorsRepository;
