import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../../factories";
import { createProject } from "../../factories/projects-factory";
import { cleanDb, generateValidToken } from "../../helpers";
import { invalidBodyDataSet } from "./list-controller-dataset";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /lists", () => {
  describe("when body is invalid", () => {
    it("should return status 400 when body is not given", async () => {
      const token = await generateValidToken();

      const response = await server
        .post("/lists")
        .set("Authorization", `Bearer ${token}`);

      const findList = await prisma.list.findMany({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(findList.length).toStrictEqual(0);
    });

    it.each(invalidBodyDataSet)(
      "should return status 400 when body is not valid",
      async (invalidBody) => {
        const token = await generateValidToken();

        const response = await server
          .post("/lists")
          .set("Authorization", `Bearer ${token}`)
          .send(invalidBody);

        const findList = await prisma.list.findMany({});

        expect(response.status).toStrictEqual(httpStatus.BAD_REQUEST);
        expect(findList.length).toStrictEqual(0);
      }
    );
  });

  describe("when body is valid", () => {
    const generateValidBody = (projectId?: string) => ({
      name: faker.random.words(),
      projectId: projectId || faker.datatype.uuid(),
    });

    it("should return status 201 given valid body", async () => {
      const user = await createUser();
      const project = await createProject(user);
      const token = await generateValidToken(user);
      const body = generateValidBody(project.id);

      const response = await server
        .post("/lists")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.CREATED);
    });

    it("should save project on database", async () => {
      const user = await createUser();
      const project = await createProject(user);
      const token = await generateValidToken(user);
      const body = generateValidBody(project.id);

      const response = await server
        .post("/lists")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      const list = await prisma.list.findFirst({
        where: { id: response.body.listId },
      });

      expect(list).toEqual(
        expect.objectContaining({
          id: response.body.listId,
          name: response.body.name,
        })
      );
    });

    it("should return the correct response body", async () => {
      const user = await createUser();
      const project = await createProject(user);
      const token = await generateValidToken(user);
      const body = generateValidBody(project.id);

      const response = await server
        .post("/lists")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      const list = await prisma.list.findFirst({
        where: { id: response.body.listId },
      });

      expect(response.body).toEqual(
        expect.objectContaining({
          listId: list.id,
          name: list.name,
        })
      );
    });

    it("should return status 404 if project does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = generateValidBody();

      const response = await server
        .post("/lists")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
    });

    it("should return status 403 if user is not a project participant", async () => {
      const user = await createUser();
      const project = await createProject();
      const token = await generateValidToken(user);
      const body = generateValidBody(project.id);

      const response = await server
        .post("/lists")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.FORBIDDEN);
    });
  });
});
