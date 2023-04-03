import { faker } from "@faker-js/faker";

import listsRepository from "@/repositories/lists-repository";
import listsServices, { listNotFoundError } from "@/services/lists-services";

import projectsRepository from "@/repositories/projects-repository";
import projectService, {
  projectNotFoundError,
} from "@/services/projects-services";

import participantsRepository from "@/repositories/participants-repository";
import participantServices, {
  notParticipantError,
} from "@/services/participant-services";

import cardActivityServices from "@/services/card-activities-services";

import cardsRepository, {
  CreateCardParams,
} from "@/repositories/cards-repository";
import cardsServices from "@/services/cards-services";

describe("cards-service test suite", () => {
  describe("createCard test suite", () => {
    const userIdMock = faker.datatype.uuid();

    const projectMock = {
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      ownerId: userIdMock,
    };

    const listMock = {
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      projectId: projectMock.id,
    };

    const cardMock: CreateCardParams = {
      title: faker.random.words(),
      listId: listMock.id,
    };

    it("should throw not found error if list does not exist", async () => {
      jest
        .spyOn(listsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      const promise = cardsServices.createCard(cardMock, userIdMock);

      expect(promise).rejects.toStrictEqual(listNotFoundError());
    });

    it("should throw not found error if project does not exist", async () => {
      jest
        .spyOn(listsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return listMock;
        });

      jest
        .spyOn(projectsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      const promise = cardsServices.createCard(cardMock, userIdMock);

      expect(promise).rejects.toStrictEqual(projectNotFoundError());
    });

    it("should throw not allowed error if user is not a project participant", async () => {
      jest
        .spyOn(listsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return listMock;
        });

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

      const promise = cardsServices.createCard(cardMock, userIdMock);

      expect(promise).rejects.toStrictEqual(notParticipantError());
    });

    it("should be able to create card", async () => {
      jest
        .spyOn(listsServices, "validateListOrFail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return listMock;
        });

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
        .spyOn(cardsRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return cardMock;
        });

      jest
        .spyOn(cardActivityServices, "createCardActivity")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      const promise = cardsServices.createCard(cardMock, userIdMock);

      expect(promise).resolves.toStrictEqual({
        title: cardMock.title,
        listId: cardMock.listId,
      });
    });
  });
});
