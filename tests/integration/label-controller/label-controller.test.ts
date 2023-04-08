import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";

import app, { init } from "@/app";
import { prisma } from "@/config";
import { cleanDb, generateValidToken } from "../../helpers";

import { invalidBodyDataSet } from "./label-controller-dataset";
import { createColor, createProject, createUser } from "../../factories";
import { CreateLabelParams } from "@/repositories/labels-repository";
import { Color, User } from "@prisma/client";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

let user: User;
let token: string;
let projectId: string;
let color: Color;

beforeEach(async () => {
  user = await createUser();
  token = await generateValidToken(user);
  const project = await createProject(user);
  color = await createColor();

  projectId = project.id;
});

describe("POST /labels", () => {
  describe("when user is unauthenticated", () => {
    it("should return 401 and unauthenticated error when authorization token is invalid", async () => {
      const response = await server
        .post(`/projects/${projectId}/labels`)
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
        .post(`/projects/${projectId}/labels`)
        .set("Authorization", `Bearer ${token}`);

      const findLabel = await prisma.label.findMany({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(findLabel.length).toStrictEqual(0);
    });

    it.each(invalidBodyDataSet)(
      "should return status 400 when body is not valid",
      async (invalidBody) => {
        const response = await server
          .post(`/projects/${projectId}/labels`)
          .set("Authorization", `Bearer ${token}`)
          .send(invalidBody);

        const findLabel = await prisma.label.findMany({});

        expect(response.status).toStrictEqual(httpStatus.BAD_REQUEST);
        expect(findLabel.length).toStrictEqual(0);
      }
    );
  });

  describe("when body is valid", () => {
    let validBody: Partial<CreateLabelParams>;

    beforeEach(() => {
      validBody = {
        title: faker.random.words(),
        colorName: color.name,
      };
    });

    it("should return status 201 given valid body", async () => {
      const response = await server
        .post(`/projects/${projectId}/labels`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toStrictEqual(httpStatus.CREATED);
    });

    it("should save label on database", async () => {
      const response = await server
        .post(`/projects/${projectId}/labels`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      const label = await prisma.label.findUnique({
        where: { id: response.body.labelId },
      });

      expect(label).toStrictEqual({
        id: response.body.labelId,
        title: response.body.title,
        projectId: projectId,
        colorName: response.body.colorName,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("should return the correct response body", async () => {
      const response = await server
        .post(`/projects/${projectId}/labels`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      const label = await prisma.label.findUnique({
        where: { id: response.body.labelId },
      });

      expect(response.body).toStrictEqual({
        labelId: label.id,
        title: label.title,
        colorName: label.colorName,
      });
    });

    it("should return status 404 if color does not exist", async () => {
      validBody.colorName = faker.random.word();

      const response = await server
        .post(`/projects/${projectId}/labels`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
      expect(response.body).toStrictEqual({
        name: "ColorNotFoundError",
        message: "There is no color with given colorName",
      });
    });

    it("should return status 404 if project does not exist", async () => {
      projectId = faker.datatype.uuid();

      const response = await server
        .post(`/projects/${projectId}/labels`)
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
        .post(`/projects/${projectId}/labels`)
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
