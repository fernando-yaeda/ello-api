import { faker } from "@faker-js/faker";

import projectsRepository from "@/repositories/projects-repository";
import projectService, {
  projectNotFoundError,
} from "@/services/projects-services";

import participantsRepository from "@/repositories/participants-repository";
import participantServices, {
  notParticipantError,
} from "@/services/participant-services";

import listsRepository, {
  CreateListParams,
} from "@/repositories/lists-repository";
import listsService from "@/services/lists-services";

describe("lists-service test suite", () => {
  describe("createList test suite", () => {
    const userIdMock = faker.datatype.uuid();

    const projectMock = {
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      ownerId: userIdMock,
    };

    const listMock: CreateListParams = {
      name: faker.random.words(),
      projectId: projectMock.id,
    };

    it("should throw not found error if project does not exist", async () => {
      jest
        .spyOn(projectsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      const promise = listsService.createList(listMock, userIdMock);

      expect(promise).rejects.toStrictEqual(projectNotFoundError());
    });

    it("should throw not allowed error if user is not a project participant", async () => {
      jest
        .spyOn(projectsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return projectMock;
        });

      jest
        .spyOn(participantsRepository, "findByIndex")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      const promise = listsService.createList(listMock, faker.datatype.uuid());

      expect(promise).rejects.toStrictEqual(notParticipantError());
    });

    it("should be able to create list", async () => {
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
        .spyOn(listsRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return listMock;
        });

      const promise = listsService.createList(listMock, userIdMock);

      expect(promise).resolves.toStrictEqual(listMock);
    });
  });
});
