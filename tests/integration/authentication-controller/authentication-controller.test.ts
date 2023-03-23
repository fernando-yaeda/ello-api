import { faker } from "@faker-js/faker";
import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../../factories";
import { cleanDb } from "../../helpers";
import { invalidBodyDataSet } from "./authentication-controller-dataset";
import jwt, { JwtPayload } from "jsonwebtoken";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /auth/sign-in", () => {
  describe("when body is invalid", () => {
    it("should return status 400 when body is not given", async () => {
      const response = await server.post("/auth/sign-in");

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it.each(invalidBodyDataSet)(
      "should return status 400 when body is not valid",
      async (invalidBody) => {
        const response = await server.post("/auth/sign-in").send(invalidBody);

        expect(response.status).toStrictEqual(httpStatus.BAD_REQUEST);
      }
    );
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    it("should return status 401 given incorrect email", async () => {
      const body = generateValidBody();

      const response = await server.post("/auth/sign-in").send(body);

      expect(response.status).toStrictEqual(httpStatus.UNAUTHORIZED);
    });

    it("should return status 401 given incorrect password", async () => {
      const body = generateValidBody();

      await createUser(body);

      const response = await server.post("/auth/sign-in").send({
        ...body,
        password: faker.internet.password(),
      });

      expect(response.status).toStrictEqual(httpStatus.UNAUTHORIZED);
    });

    describe("when credentials are valid", () => {
      it("should return correct user data and status 200", async () => {
        const body = generateValidBody();

        const user = await createUser(body);

        const response = await server.post("/auth/sign-in").send(body);

        expect(response.body.user).toEqual({
          id: user.id,
          email: user.email,
          username: user.username,
        });
        expect(response.status).toStrictEqual(httpStatus.OK);
      });

      it("should return correct session token", async () => {
        const body = generateValidBody();

        const user = await createUser(body);

        const response = await server.post("/auth/sign-in").send(body);

        expect(response.body.token).toBeDefined();

        const tokenVerify = jwt.verify(
          response.body.token,
          process.env.JWT_SECRET
        ) as JwtPayload;

        expect(tokenVerify.userId).toStrictEqual(user.id);
      });
    });
  });
});
