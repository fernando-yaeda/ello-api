import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../../factories";
import { createList } from "../../factories/lists-factory";
import { cleanDb, generateValidToken } from "../../helpers";
import { invalidBodyDataSet } from "./card-controller-dataset";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /cards", () => {
  describe("when body is invalid", () => {
    it("should return status 400 when body is not given", async () => {
      const token = await generateValidToken();

      const response = await server
        .post("/cards")
        .set("Authorization", `Bearer ${token}`);

      const findCard = await prisma.card.findMany({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(findCard.length).toStrictEqual(0);
    });

    it.each(invalidBodyDataSet)(
      "should return status 400 when body is not valid",
      async (invalidBody) => {
        const token = await generateValidToken();

        const response = await server
          .post("/cards")
          .set("Authorization", `Bearer ${token}`)
          .send(invalidBody);

        const findCard = await prisma.card.findMany({});

        expect(response.status).toStrictEqual(httpStatus.BAD_REQUEST);
        expect(findCard.length).toStrictEqual(0);
      }
    );
  });

  describe("when body is valid", () => {
    const generateValidBody = (listId?: string) => ({
      title: faker.random.words(),
      listId: listId || faker.datatype.uuid(),
    });

    it("should return status 201 given valid body", async () => {
      const user = await createUser();
      const list = await createList(user);
      const token = await generateValidToken(user);
      const body = generateValidBody(list.id);

      const response = await server
        .post("/cards")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.CREATED);
    });

    it("should save card on database", async () => {
      const user = await createUser();
      const list = await createList(user);
      const token = await generateValidToken(user);
      const body = generateValidBody(list.id);

      const response = await server
        .post("/cards")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      const card = await prisma.card.findUnique({
        where: { id: response.body.cardId },
      });

      expect(card).toEqual(
        expect.objectContaining({
          id: response.body.cardId,
          title: response.body.title,
        })
      );
    });

    it("should correctly save card activity on database", async () => {
      const user = await createUser();
      const list = await createList(user);
      const token = await generateValidToken(user);
      const body = generateValidBody(list.id);

      const response = await server
        .post("/cards")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      const cardActivity = await prisma.cardActivity.findFirst({
        where: { cardId: response.body.cardId },
      });

      expect(cardActivity).toStrictEqual({
        id: expect.any(String),
        actionPerformed: "created",
        cardId: response.body.cardId,
        performedBy: user.id,
        createdAt: expect.any(Date),
      });
    });

    it("should return the correct response body", async () => {
      const user = await createUser();
      const list = await createList(user);
      const token = await generateValidToken(user);
      const body = generateValidBody(list.id);

      const response = await server
        .post("/cards")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      const card = await prisma.card.findUnique({
        where: { id: response.body.cardId },
      });

      expect(response.body).toEqual(
        expect.objectContaining({
          cardId: card.id,
          title: card.title,
        })
      );
    });

    it("should return status 404 if project does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = generateValidBody();

      const response = await server
        .post("/cards")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
    });

    it("should return status 404 if list does not exist", async () => {
      const user = await createUser();
      await createList(user);
      const token = await generateValidToken(user);
      const body = generateValidBody();

      const response = await server
        .post("/cards")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
    });

    it("should return status 403 if user is not a project participant", async () => {
      const user = await createUser();
      const list = await createList();
      const token = await generateValidToken(user);
      const body = generateValidBody(list.id);

      const response = await server
        .post("/cards")
        .set("Authorization", `Bearer ${token}`)
        .send(body);

      expect(response.status).toStrictEqual(httpStatus.FORBIDDEN);
    });
  });
});
