import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";

import app, { init } from "@/app";
import { prisma } from "@/config";
import { cleanDb, generateValidToken } from "../../helpers";

import {
  createProject,
  createUser,
  createList,
  createCard,
  createCardActivity,
} from "../../factories";
import { invalidBodyDataSet } from "./card-controller-dataset";
import { CardActivity, User } from "@prisma/client";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

let user: User;
let token: string;
let projectId: string;
let listId: string;
let cardId: string;
let cardActivity: CardActivity;

beforeEach(async () => {
  user = await createUser();
  token = await generateValidToken(user);
  const project = await createProject(user);
  const list = await createList({ user, project });

  projectId = project.id;
  listId = list.id;
});

describe("POST /cards", () => {
  describe("when user is unauthenticated", () => {
    it("should return 401 and unauthenticated error when authorization token is invalid", async () => {
      const response = await server
        .post(`/projects/${projectId}/lists/${listId}/cards`)
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
        .post(`/projects/${projectId}/lists/${listId}/cards`)
        .set("Authorization", `Bearer ${token}`);

      const findCard = await prisma.card.findMany({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(findCard.length).toStrictEqual(0);
    });

    it.each(invalidBodyDataSet)(
      "should return status 400 when body is not valid",
      async (invalidBody) => {
        const response = await server
          .post(`/projects/${projectId}/lists/${listId}/cards`)
          .set("Authorization", `Bearer ${token}`)
          .send(invalidBody);

        const findCard = await prisma.card.findMany({});

        expect(response.status).toStrictEqual(httpStatus.BAD_REQUEST);
        expect(findCard.length).toStrictEqual(0);
      }
    );
  });

  describe("when body is valid", () => {
    let validBody: { title: string };

    beforeEach(() => {
      validBody = {
        title: faker.random.words(),
      };
    });

    it("should return status 201 given valid body", async () => {
      const response = await server
        .post(`/projects/${projectId}/lists/${listId}/cards`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toStrictEqual(httpStatus.CREATED);
    });

    it("should save card on database", async () => {
      const response = await server
        .post(`/projects/${projectId}/lists/${listId}/cards`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      const card = await prisma.card.findUnique({
        where: { id: response.body.cardId },
      });

      expect(card).toStrictEqual({
        id: response.body.cardId,
        description: null,
        title: response.body.title,
        listId: listId,
      });
    });

    it("should correctly save card activity on database", async () => {
      const response = await server
        .post(`/projects/${projectId}/lists/${listId}/cards`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

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
      const response = await server
        .post(`/projects/${projectId}/lists/${listId}/cards`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      const card = await prisma.card.findUnique({
        where: { id: response.body.cardId },
      });

      expect(response.body).toStrictEqual({
        cardId: card.id,
        title: card.title,
      });
    });

    it("should return status 404 if project does not exist", async () => {
      projectId = faker.datatype.uuid();

      const response = await server
        .post(`/projects/${projectId}/lists/${listId}/cards`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
      expect(response.body).toStrictEqual({
        name: "ProjectNotFoundError",
        message: "There is no project with given id",
      });
    });

    it("should return status 404 if list does not exist", async () => {
      listId = faker.datatype.uuid();

      const response = await server
        .post(`/projects/${projectId}/lists/${listId}/cards`)
        .set("Authorization", `Bearer ${token}`)
        .send(validBody);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
      expect(response.body).toStrictEqual({
        name: "ListNotFoundError",
        message: "There is no list with given id",
      });
    });

    it("should return status 403 if user is not a project participant", async () => {
      user = await createUser();
      token = await generateValidToken(user);

      const response = await server
        .post(`/projects/${projectId}/lists/${listId}/cards`)
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

describe("GET /cards", () => {
  beforeEach(async () => {
    user = await createUser();
    token = await generateValidToken(user);
    const project = await createProject(user);
    const list = await createList({ user, project });
    const card = await createCard({ list });
    cardActivity = await createCardActivity({ user, card });

    projectId = project.id;
    listId = list.id;
    cardId = card.id;
  });

  describe("when fail at middlewares", () => {
    it("should return 401 and unauthenticated error when authorization token is invalid", async () => {
      const response = await server
        .get(`/projects/${projectId}/lists/${listId}/cards/${cardId}`)
        .set("Authorization", `Bearer ${faker.datatype.string()}`);

      expect(response.status).toStrictEqual(httpStatus.UNAUTHORIZED);
      expect(response.body).toStrictEqual({
        name: "UnauthorizedError",
        message: "You need to authenticate to access this content",
      });
    });

    it("should return status 404 if project does not exist", async () => {
      projectId = faker.datatype.uuid();

      const response = await server
        .get(`/projects/${projectId}/lists/${listId}/cards/${cardId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
      expect(response.body).toStrictEqual({
        name: "ProjectNotFoundError",
        message: "There is no project with given id",
      });
    });

    it("should return status 404 if list does not exist", async () => {
      listId = faker.datatype.uuid();

      const response = await server
        .get(`/projects/${projectId}/lists/${listId}/cards/${cardId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
      expect(response.body).toStrictEqual({
        name: "ListNotFoundError",
        message: "There is no list with given id",
      });
    });

    it("should return status 403 if user is not a project participant", async () => {
      user = await createUser();
      token = await generateValidToken(user);

      const response = await server
        .get(`/projects/${projectId}/lists/${listId}/cards/${cardId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toStrictEqual(httpStatus.FORBIDDEN);
      expect(response.body).toStrictEqual({
        name: "NotParticipantError",
        message: "You are not a participant on this project",
      });
    });
  });

  describe("when passes through middlewares", () => {
    it("should return 404 if card does not exists", async () => {
      cardId = faker.datatype.uuid();

      const response = await server
        .get(`/projects/${projectId}/lists/${listId}/cards/${cardId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toStrictEqual(httpStatus.NOT_FOUND);
      expect(response.body).toStrictEqual({
        name: "CardNotFoundError",
        message: "Could not find a card with the given id",
      });
    });

    it("should return correctly if card exists", async () => {
      const response = await server
        .get(`/projects/${projectId}/lists/${listId}/cards/${cardId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toStrictEqual(httpStatus.OK);
      expect(response.body).toStrictEqual({
        id: cardId,
        title: expect.any(String),
        description: null,
        listId: listId,
        cardLabels: [],
        activity: [
          { ...cardActivity, createdAt: cardActivity.createdAt.toISOString() },
        ],
      });
    });
  });
});
