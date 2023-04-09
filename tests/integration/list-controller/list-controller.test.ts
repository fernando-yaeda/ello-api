import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";

import app, { init } from "@/app";
import { prisma } from "@/config";
import { cleanDb, generateValidToken } from "../../helpers";

import { createUser, createProject } from "../../factories";
import { invalidBodyDataSet } from "./list-controller-dataset";
import { User } from "@prisma/client";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

let user: User;
let token: string;
let projectId: string;

beforeEach(async () => {
  user = await createUser();
  token = await generateValidToken(user);
  const project = await createProject(user);

  projectId = project.id;
});

describe("POST /lists", () => {
  describe("when user is unauthenticated", () => {
    it("should return 401 and unauthenticated error when authorization token is invalid", async () => {
      const response = await server
        .post(`/projects/${projectId}/lists`)
        .set("Authorization", `Bearer ${faker.datatype.string()}`);

      expect(response.status).toStrictEqual(httpStatus.UNAUTHORIZED);
      expect(response.body).toStrictEqual({
        name: "UnauthorizedError",
        message: "You need to authenticate to access this content",
      });
    });
  });

  describe("when body is invalid", () => {
    it("should return status 400 when body is not given", async () => {
      const response = await server
        .post(`/projects/${projectId}/lists/`)
        .set("Authorization", `Bearer ${token}`);

      const findList = await prisma.list.findMany({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(findList.length).toStrictEqual(0);
    });

    it.each(invalidBodyDataSet)(
      "should return status 400 when body is not valid",
      async (invalidBody) => {
        const response = await server
          .post(`/projects/${projectId}/lists/`)
          .set("Authorization", `Bearer ${token}`)
          .send(invalidBody);

        const findList = await prisma.list.findMany({});

        expect(response.status).toStrictEqual(httpStatus.BAD_REQUEST);
        expect(findList.length).toStrictEqual(0);
      }
    );
  });

  describe("when body is valid", () => {
    let validBody: { name: string };

    beforeEach(() => {
      validBody = {
        name: faker.random.words(),
      };
    });

    it("should return status 201 given valid body", async () => {
      const response = await server
        .post(`/projects/${projectId}/lists/`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toStrictEqual(httpStatus.CREATED);
    });

    it("should save project on database", async () => {
      const response = await server
        .post(`/projects/${projectId}/lists/`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      const list = await prisma.list.findFirst({
        where: { id: response.body.listId },
      });

      expect(list).toStrictEqual({
        id: response.body.listId,
        name: response.body.name,
        projectId: projectId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("should return the correct response body", async () => {
      const response = await server
        .post(`/projects/${projectId}/lists/`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      const list = await prisma.list.findFirst({
        where: { id: response.body.listId },
      });

      expect(response.body).toStrictEqual({
        listId: list.id,
        name: list.name,
      });
    });

    it("should return status 404 if project does not exist", async () => {
      projectId = faker.datatype.uuid();

      const response = await server
        .post(`/projects/${projectId}/lists/`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
      expect(response.body).toStrictEqual({
        name: "ProjectNotFoundError",
        message: "There is no project with given id",
      });
    });

    it("should return status 403 if user is not a project participant", async () => {
      user = await createUser();
      token = await generateValidToken(user);

      const response = await server
        .post(`/projects/${projectId}/lists/`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toStrictEqual(httpStatus.FORBIDDEN);
      expect(response.body).toStrictEqual({
        name: "NotParticipantError",
        message: "You are not a participant on this project",
      });
    });
  });
});
