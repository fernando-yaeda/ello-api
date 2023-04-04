import colorsRepository from "@/repositories/colors-repository";
import { Color } from "@prisma/client";
import { colorNotFoundError } from "./errors";

async function getByName(colorName: string): Promise<Color> {
  const color = await colorsRepository.findByName(colorName);

  if (!color) throw colorNotFoundError();

  return color;
}

const colorServices = {
  getByName,
};

export * from "./errors";
export default colorServices;
