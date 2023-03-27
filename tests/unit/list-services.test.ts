import listsService, { notAllowedError } from "@/services/lists-services";
import listsRepository, {
  CreateListParams,
} from "@/repositories/lists-repository";
import { faker } from "@faker-js/faker";
import projectsRepository from "@/repositories/projects-repository";
import { projectNotFoundError } from "@/services/projects-services";

describe("lists-service test suite", () => {
  describe("createList test suite", () => {
    const listMock: CreateListParams = {
      name: faker.random.words(),
      projectId: faker.datatype.uuid(),
    };

    const projectMock = {
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      ownerId: faker.datatype.uuid(),
    };

    const userIdMock = faker.datatype.uuid();

    it("should throw not found error if project does not exist", async () => {
      jest
        .spyOn(projectsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return null;
        });

      const promise = listsService.createList(listMock, userIdMock);

      expect(promise).rejects.toStrictEqual(projectNotFoundError());
    });

    it("should throw not allowed error if user is not the project owner", async () => {
      jest
        .spyOn(projectsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return projectMock;
        });

      const promise = listsService.createList(
        { ...listMock, projectId: projectMock.id },
        userIdMock
      );

      expect(promise).rejects.toStrictEqual(notAllowedError());
    });

    it("should be able to create list", async () => {
      jest
        .spyOn(projectsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return projectMock;
        });

      jest
        .spyOn(listsRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return listMock;
        });

      const promise = listsService.createList(listMock, projectMock.ownerId);

      expect(promise).resolves.toStrictEqual({
        name: listMock.name,
        projectId: listMock.projectId,
      });
    });
  });
});
