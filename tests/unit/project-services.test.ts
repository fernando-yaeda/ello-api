import projectService from "@/services/projects-services";
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

    it("should be able to create an project", async () => {
      jest
        .spyOn(projectsRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return projectMock;
        });

      const promise = projectService.createProject(projectMock);

      expect(promise).resolves.toStrictEqual(projectMock);
    });
  });
});
