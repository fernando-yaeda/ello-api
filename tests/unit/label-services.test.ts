import { faker } from "@faker-js/faker";

import projectService, {
  projectNotFoundError,
} from "@/services/projects-services";
import participantServices, {
  notParticipantError,
} from "@/services/participant-services";
import colorServices, { colorNotFoundError } from "@/services/color-services";

import labelsRepository, {
  CreateLabelParams,
} from "@/repositories/labels-repository";
import labelServices from "@/services/label-services";

describe("label-services test suite", () => {
  describe("createLabel test suite", () => {
    const labelMock: CreateLabelParams = {
      projectId: faker.datatype.uuid(),
      title: faker.random.words(),
      colorName: faker.color.rgb({ format: "css" }),
    };

    const userIdMock = faker.datatype.uuid();

    it("should thow error if project is not valid", async () => {
      jest
        .spyOn(projectService, "validateProjectOrFail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          throw projectNotFoundError();
        });

      const promise = labelServices.createLabel(labelMock, userIdMock);

      expect(promise).rejects.toStrictEqual(projectNotFoundError());
    });

    it("should thow error if user is not a project participant", async () => {
      jest
        .spyOn(projectService, "validateProjectOrFail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      jest
        .spyOn(participantServices, "validateParticipant")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          throw notParticipantError();
        });

      const promise = labelServices.createLabel(labelMock, userIdMock);

      expect(promise).rejects.toStrictEqual(notParticipantError());
    });

    it("should throw error if colorName is not valid", async () => {
      jest
        .spyOn(projectService, "validateProjectOrFail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      jest
        .spyOn(participantServices, "validateParticipant")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      jest
        .spyOn(colorServices, "getByName")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          throw colorNotFoundError();
        });

      const promise = labelServices.createLabel(labelMock, userIdMock);

      expect(promise).rejects.toStrictEqual(colorNotFoundError());
    });

    it("should return correcly label given valid input", async () => {
      jest
        .spyOn(projectService, "validateProjectOrFail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      jest
        .spyOn(participantServices, "validateParticipant")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      jest
        .spyOn(colorServices, "getByName")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      jest
        .spyOn(labelsRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return labelMock;
        });

      const promise = labelServices.createLabel(labelMock, userIdMock);

      expect(promise).resolves.toStrictEqual(labelMock);
    });
  });
});
