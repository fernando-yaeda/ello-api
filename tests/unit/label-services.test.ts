import { faker } from "@faker-js/faker";

import colorServices, { colorNotFoundError } from "@/services/color-services";

import labelsRepository, {
  CreateLabelParams,
} from "@/repositories/labels-repository";
import labelServices from "@/services/label-services";
import { Label } from "@prisma/client";

describe("labelMock-services test suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  jest.mock("@/repositories/labels-repository", () => {
    create: jest.fn();
  });

  jest.mock("@/services/color-services", () => ({
    getByName: jest.fn(),
  }));

  const labelMock: Label = {
    id: faker.datatype.uuid(),
    title: faker.random.word(),
    projectId: faker.datatype.uuid(),
    colorName: faker.color.human(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
  };

  describe("createLabel test suite", () => {
    const createLabel: CreateLabelParams = {
      projectId: labelMock.projectId,
      title: labelMock.title,
      colorName: labelMock.colorName,
    };

    it("should throw error if colorName is not valid", async () => {
      jest
        .spyOn(colorServices, "getByName")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockRejectedValueOnce(colorNotFoundError());

      const promise = labelServices.createLabel(createLabel);

      expect(promise).rejects.toStrictEqual(colorNotFoundError());
      expect(jest.spyOn(labelsRepository, "create")).not.toHaveBeenCalled();
    });

    it("should return correcly labelMock given valid input", async () => {
      jest.spyOn(colorServices, "getByName").mockResolvedValueOnce({
        id: faker.datatype.uuid(),
        name: labelMock.colorName,
        color: faker.color.rgb({ format: "css" }),
      });

      jest.spyOn(labelsRepository, "create").mockResolvedValueOnce(labelMock);

      const label = await labelServices.createLabel(createLabel);

      expect(label).toStrictEqual(labelMock);
      expect(colorServices.getByName).toBeCalledWith(createLabel.colorName);
      expect(labelsRepository.create).toBeCalledWith(createLabel);
    });
  });
});
