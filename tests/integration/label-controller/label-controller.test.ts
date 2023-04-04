import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../../helpers";
import { invalidBodyDataSet } from "./label-controller-dataset";
import { createColor, createProject, createUser } from "../../factories";
import { CreateLabelParams } from "@/repositories/labels-repository";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /labels", () => {
  describe("when body is invalid", () => {
    it("should return status 400 when body is not given", async () => {
      const token = await generateValidToken();

      const response = await server
        .post("/labels")
        .set("Authorization", `Bearer ${token}`);

      const findLabel = await prisma.label.findMany({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(findLabel.length).toStrictEqual(0);
    });

    it.each(invalidBodyDataSet)(
      "should return status 400 when body is not valid",
      async (invalidBody) => {
        const token = await generateValidToken();

        const response = await server
          .post("/labels")
          .set("Authorization", `Bearer ${token}`)
          .send(invalidBody);

        const findLabel = await prisma.label.findMany({});

        expect(response.status).toStrictEqual(httpStatus.BAD_REQUEST);
        expect(findLabel.length).toStrictEqual(0);
      }
    );
  });

  describe("when body is valid", () => {
    const generateValidBody = ({
      projectId,
      colorName,
    }: Partial<CreateLabelParams>) => ({
      title: faker.random.words(),
      projectId: projectId || faker.datatype.uuid(),
      colorName: colorName || faker.random.words(),
    });

    it("should return status 201 given valid body", async () => {
      const user = await createUser();
      const project = await createProject(user);
      const color = await createColor();
      const token = await generateValidToken(user);
      const body = generateValidBody({
        projectId: project.id,
        colorName: color.name,
      });

      const response = await server
        .post("/labels")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.CREATED);
    });

    it("should save label on database", async () => {
      const user = await createUser();
      const project = await createProject(user);
      const color = await createColor();
      const token = await generateValidToken(user);
      const body = generateValidBody({
        projectId: project.id,
        colorName: color.name,
      });

      const response = await server
        .post("/labels")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      const label = await prisma.label.findUnique({
        where: { id: response.body.labelId },
      });

      expect(label).toStrictEqual({
        id: response.body.labelId,
        title: response.body.title,
        projectId: project.id,
        colorName: response.body.colorName,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("should return the correct response body", async () => {
      const user = await createUser();
      const project = await createProject(user);
      const color = await createColor();
      const token = await generateValidToken(user);
      const body = generateValidBody({
        projectId: project.id,
        colorName: color.name,
      });

      const response = await server
        .post("/labels")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      const label = await prisma.label.findUnique({
        where: { id: response.body.labelId },
      });

      expect(response.body).toStrictEqual({
        labelId: label.id,
        title: label.title,
        colorName: label.colorName,
      });
    });

    it("should return status 404 if project does not exist", async () => {
      const projectId = faker.datatype.uuid();
      const user = await createUser();
      const color = await createColor();
      const token = await generateValidToken(user);
      const body = generateValidBody({
        projectId: projectId,
        colorName: color.name,
      });

      const response = await server
        .post("/labels")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
    });

    it("should return status 403 if user is not a project participant", async () => {
      const user = await createUser();
      const project = await createProject();
      const color = await createColor();
      const token = await generateValidToken(user);
      const body = generateValidBody({
        projectId: project.id,
        colorName: color.name,
      });

      const response = await server
        .post("/labels")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.FORBIDDEN);
    });
  });
});
