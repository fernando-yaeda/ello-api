import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";

import app, { init } from "@/app";
import { prisma } from "@/config";
import { cleanDb, generateValidToken } from "../../helpers";

import { createUser } from "../../factories";
import { invalidBodyDataSet } from "./project-controller-dataset";
import { User } from "@prisma/client";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

let user: User;
let token: string;

beforeEach(async () => {
  user = await createUser();
  token = await generateValidToken(user);
});

describe("POST /projects", () => {
  describe("when user is unauthenticated", () => {
    it("should return 401 and unauthenticated error when authorization token is invalid", async () => {
      const response = await server
        .post(`/projects`)
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
        .post("/projects")
        .set("Authorization", `Bearer ${token}`);

      const findProject = await prisma.project.findMany({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(findProject.length).toStrictEqual(0);
    });

    it.each(invalidBodyDataSet)(
      "should return status 400 when body is not valid",
      async (invalidBody) => {
        const response = await server
          .post("/projects")
          .set("Authorization", `Bearer ${token}`)
          .send(invalidBody);

        const findProject = await prisma.project.findMany({});

        expect(response.status).toStrictEqual(httpStatus.BAD_REQUEST);
        expect(findProject.length).toStrictEqual(0);
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
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toBe(httpStatus.CREATED);
    });

    it("should save project on database", async () => {
      const response = await server
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      const project = await prisma.project.findFirst({
        where: { ownerId: user.id },
      });

      expect(project).toStrictEqual({
        id: expect.any(String),
        name: response.body.name,
        ownerId: response.body.ownerId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("should correctly save user to project participants on database", async () => {
      await server
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      const project = await prisma.project.findFirst({
        where: { ownerId: user.id },
      });

      const participant = await prisma.participant.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: project.id,
          },
        },
      });

      expect(participant).toStrictEqual({
        id: expect.any(String),
        userId: user.id,
        projectId: project.id,
        isAdmin: true,
      });
    });

    it("should return the correct response body", async () => {
      const response = await server
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      const project = await prisma.project.findFirst({
        where: { ownerId: user.id },
      });

      expect(response.body).toEqual(
        expect.objectContaining({
          projectId: project.id,
          name: project.name,
          ownerId: project.ownerId,
        })
      );
    });
  });
});
