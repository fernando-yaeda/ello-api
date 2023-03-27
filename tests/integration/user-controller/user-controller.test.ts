import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../../factories";
import { cleanDb } from "../../helpers";
import { invalidBodyDataSet } from "./user-controller-dataset";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /users", () => {
  describe("when body is invalid", () => {
    it("should return status 400 when body is not given", async () => {
      const response = await server.post("/users");

      const findUser = await prisma.user.findMany({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(findUser.length).toStrictEqual(0);
    });

    it.each(invalidBodyDataSet)(
      "should return status 400 when body is not valid",
      async (invalidBody) => {
        const response = await server.post("/users").send(invalidBody);

        const findUser = await prisma.user.findMany({});

        expect(response.status).toStrictEqual(httpStatus.BAD_REQUEST);
        expect(findUser.length).toStrictEqual(0);
      }
    );
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });

    it("should return status 201 given valid body", async () => {
      const body = generateValidBody();

      const response = await server.post("/users").send(body);

      expect(response.status).toBe(httpStatus.CREATED);
    });

    it("should return status 409 when email was already taken", async () => {
      const body = generateValidBody();

      await createUser(body);

      const response = await server.post("/users").send(body);

      const findUser = await prisma.user.findMany({
        where: { email: body.email },
      });
      expect(findUser.length).toStrictEqual(1);

      expect(response.status).toStrictEqual(httpStatus.CONFLICT);
    });

    it("should save user on database", async () => {
      const body = generateValidBody();

      const response = await server.post("/users").send(body);

      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      expect(user).toEqual(
        expect.objectContaining({
          id: response.body.id,
          email: body.email,
        })
      );
    });

    it("should return the correct response body", async () => {
      const body = generateValidBody();

      const response = await server.post("/users").send(body);

      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      expect(response.body).toStrictEqual({
        id: user.id,
        email: user.email,
      });
    });
  });
});
