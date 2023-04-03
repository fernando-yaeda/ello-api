import projectService, {
  projectNotFoundError,
} from "@/services/projects-services";
import projectsRepository, {
  CreateProjectParams,
} from "@/repositories/projects-repository";
import { faker } from "@faker-js/faker";

describe("projects-service test suite", () => {
  describe("createProject test suite", () => {
    const projectMock: CreateProjectParams = {
      name: faker.random.words(),
      ownerId: faker.datatype.uuid(),
    };

    const projectIdMock = faker.datatype.uuid();

    const participantIdMock = faker.datatype.uuid();

    it("should be able to create an project", async () => {
      jest
        .spyOn(projectsRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return {
            id: projectIdMock,
            ...projectMock,
            participants: [
              {
                id: participantIdMock,
                userId: projectMock.ownerId,
                projectId: projectIdMock,
                isAdmin: true,
              },
            ],
          };
        });

      const promise = projectService.createProject(projectMock);

      expect(promise).resolves.toStrictEqual({
        id: projectIdMock,
        ...projectMock,
        participants: [
          {
            id: participantIdMock,
            userId: projectMock.ownerId,
            projectId: projectIdMock,
            isAdmin: true,
          },
        ],
      });
    });
  });

  describe("validateProjectOrFail test suite", () => {
    const projectIdMock = faker.datatype.uuid();

    const projectMock: CreateProjectParams = {
      name: faker.random.words(),
      ownerId: faker.datatype.uuid(),
    };

    it("should throw an error if project does not exist", async () => {
      jest
        .spyOn(projectsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return null;
        });

      const promise = projectService.validateProjectOrFail(projectIdMock);

      expect(promise).rejects.toStrictEqual(projectNotFoundError());
    });

    it("should return project given an correct projectId", async () => {
      jest
        .spyOn(projectsRepository, "findById")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return {
            ...projectMock,
            projectIdMock,
          };
        });

      const promise = projectService.validateProjectOrFail(projectIdMock);

      expect(promise).resolves.toStrictEqual({
        ...projectMock,
        projectIdMock,
      });
    });
  });
});
