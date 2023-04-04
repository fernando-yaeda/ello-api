import { faker } from "@faker-js/faker";

import colorsRepository from "@/repositories/colors-repository";
import colorServices, { colorNotFoundError } from "@/services/color-services";

describe("color-services test suite", () => {
  describe("getByName test suite", () => {
    const colorMock = {
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      color: faker.color.rgb({ format: "css" }),
    };

    it("should thow error is there is no color with given colorName", async () => {
      jest
        .spyOn(colorsRepository, "findByName")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      const promise = colorServices.getByName(colorMock.name);

      expect(promise).rejects.toStrictEqual(colorNotFoundError());
    });

    it("should return correct color given a valid colorName", async () => {
      jest
        .spyOn(colorsRepository, "findByName")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return colorMock;
        });

      const promise = colorServices.getByName(colorMock.name);

      expect(promise).resolves.toStrictEqual(colorMock);
    });
  });
});
