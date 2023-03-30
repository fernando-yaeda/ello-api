import cardsServices, { notAllowedError } from "@/services/cards-services";
import cardsRepository, {
  CreateCardParams,
} from "@/repositories/cards-repository";
import { faker } from "@faker-js/faker";
import listsServices, { listNotFoundError } from "@/services/lists-services";
import projectService from "@/services/projects-services";
import cardActivityServices from "@/services/card-activities-services";

describe("cards-service test suite", () => {
  describe("createCard test suite", () => {
    const cardMock: CreateCardParams = {
      title: faker.random.words(),
      listId: faker.datatype.uuid(),
    };

    const projectMock = {
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      ownerId: faker.datatype.uuid(),
    };

    const listMock = {
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      projectId: faker.datatype.uuid(),
    };

    const userIdMock = faker.datatype.uuid();

    it("should throw not found error if list does not exist", async () => {
      jest
        .spyOn(listsServices, "getListById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      const promise = cardsServices.createCard(cardMock, userIdMock);

      expect(promise).rejects.toStrictEqual(listNotFoundError());
    });

    it("should throw not allowed error if user is not the project owner", async () => {
      jest
        .spyOn(listsServices, "getListById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return listMock;
        });

      jest
        .spyOn(projectService, "validateProjectOrFail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return {
            id: listMock.projectId,
            ...projectMock,
          };
        });

      const promise = cardsServices.createCard(
        { title: cardMock.title, listId: listMock.id },
        userIdMock
      );

      expect(promise).rejects.toStrictEqual(notAllowedError());
    });

    it("should be able to create card", async () => {
      jest
        .spyOn(listsServices, "getListById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return listMock;
        });

      jest
        .spyOn(projectService, "validateProjectOrFail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return projectMock;
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

      const promise = cardsServices.createCard(cardMock, projectMock.ownerId);

      expect(promise).resolves.toStrictEqual({
        title: cardMock.title,
        listId: cardMock.listId,
      });
    });
  });
});
