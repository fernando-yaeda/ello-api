import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../../factories";
import { cleanDb, generateValidToken } from "../../helpers";
import { invalidBodyDataSet } from "./project-controller-dataset";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /projects", () => {
  describe("when body is invalid", () => {
    it("should return status 400 when body is not given", async () => {
      const token = await generateValidToken();

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
        const token = await generateValidToken();

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
    const generateValidBody = () => ({
      name: faker.random.words(),
    });

    it("should return status 201 given valid body", async () => {
      const user = await createUser();
      const body = generateValidBody();
      const token = await generateValidToken(user);

      const response = await server
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toBe(httpStatus.CREATED);
    });

    it("should save project on database", async () => {
      const user = await createUser();
      const body = generateValidBody();
      const token = await generateValidToken(user);

      const response = await server
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      const project = await prisma.project.findFirst({
        where: { ownerId: user.id },
      });

      expect(project).toEqual(
        expect.objectContaining({
          name: response.body.name,
          ownerId: response.body.ownerId,
        })
      );
    });

    it("should return the correct response body", async () => {
      const user = await createUser();
      const body = generateValidBody();
      const token = await generateValidToken(user);

      const response = await server
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

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
