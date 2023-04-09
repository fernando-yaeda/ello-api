import { faker } from "@faker-js/faker";

import projectsRepository, {
  CreateProjectParams,
} from "@/repositories/projects-repository";
import projectService, {
  projectNotFoundError,
} from "@/services/projects-services";
import { Participant, Project } from "@prisma/client";

describe("projects-service test suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  jest.mock("@/repositories/projects-repository", () => ({
    create: jest.fn(),
    findById: jest.fn(),
  }));

  const userId = faker.datatype.uuid();

  const projectMock: Project = {
    id: faker.datatype.uuid(),
    name: faker.random.word(),
    ownerId: userId,
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime(),
  };

  const participantsMock: Participant = {
    id: faker.datatype.uuid(),
    userId: userId,
    projectId: faker.datatype.uuid(),
    isAdmin: true,
  };

  describe("createProject test suite", () => {
    const createProject: CreateProjectParams = {
      name: faker.random.words(),
      ownerId: userId,
    };

    it("should be able to create an project", async () => {
      jest.spyOn(projectsRepository, "create").mockResolvedValueOnce({
        ...projectMock,
        participants: [participantsMock],
      });

      const project = await projectService.createProject(createProject);

      expect(project).toStrictEqual({
        ...projectMock,
        participants: [participantsMock],
      });
      expect(projectsRepository.create).toBeCalledWith({
        name: createProject.name,
        ownerId: createProject.ownerId,
      });
      expect(project.ownerId).toStrictEqual(createProject.ownerId);
      expect(project.participants[0]).toStrictEqual(participantsMock);
    });
  });

  describe("getById test suite", () => {
    it("should throw an error if given projectId is invalid", async () => {
      jest.spyOn(projectsRepository, "findById").mockReturnValueOnce(undefined);

      const promise = projectService.getById(projectMock.id);

      expect(promise).rejects.toStrictEqual(projectNotFoundError());
      expect(projectsRepository.findById).toBeCalledWith(projectMock.id);
    });

    it("should return project given an correct projectId", async () => {
      jest
        .spyOn(projectsRepository, "findById")
        .mockResolvedValueOnce(projectMock);

      const project = await projectService.getById(projectMock.id);

      expect(project).toStrictEqual(projectMock);
      expect(projectsRepository.findById).toBeCalledWith(projectMock.id);
    });
  });
});
