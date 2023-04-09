import { faker } from "@faker-js/faker";

import listsRepository, {
  CreateListParams,
} from "@/repositories/lists-repository";
import listsService, { listNotFoundError } from "@/services/lists-services";
import { List } from "@prisma/client";

describe("lists-service test suite", () => {
  beforeEach(() => {
    jest.clearAllMocks;
  });

  jest.mock("@/repositories/lists-repository", () => ({
    create: jest.fn(),
    findById: jest.fn(),
  }));

  const listMock: List = {
    id: faker.datatype.uuid(),
    name: faker.random.words(),
    projectId: faker.datatype.uuid(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
  };

  describe("createList test suite", () => {
    const createList: CreateListParams = {
      name: faker.random.words(),
      projectId: faker.datatype.uuid(),
    };

    it("should be able to create list", async () => {
      jest
        .spyOn(listsRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockResolvedValueOnce({
          ...listMock,
          name: createList.name,
          projectId: createList.projectId,
        });

      const list = await listsService.createList(createList);

      expect(list).toStrictEqual({
        ...listMock,
        name: createList.name,
        projectId: createList.projectId,
      });
    });
  });

  describe("getById test suite", () => {
    const listId = faker.datatype.uuid();

    it("should throw error if there is no list with given listId", async () => {
      jest.spyOn(listsRepository, "findById").mockReturnValueOnce(undefined);

      const promise = listsService.getById(listId);

      expect(promise).rejects.toStrictEqual(listNotFoundError());
    });

    it("should return a list given valid listId", async () => {
      jest.spyOn(listsRepository, "findById").mockResolvedValueOnce({
        ...listMock,
        id: listId,
      });

      const list = await listsService.getById(listId);

      expect(list).toStrictEqual({
        ...listMock,
        id: listId,
      });
    });
  });
});
