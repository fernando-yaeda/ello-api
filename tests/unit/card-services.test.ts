import { faker } from "@faker-js/faker";

import cardActivityServices from "@/services/card-activities-services";

import cardsRepository, {
  CreateCardParams,
} from "@/repositories/cards-repository";
import cardsServices, { CardNotFoundError } from "@/services/cards-services";
import { Card } from "@prisma/client";

describe("cards-service test suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  jest.mock("@/services/card-activities-services", () => ({
    createCardActivity: jest.fn(),
  }));

  jest.mock("@/repositories/cards-repository", () => ({
    create: jest.fn(),
    findById: jest.fn(),
  }));

  const userId = faker.datatype.uuid();

  const cardMock: Card = {
    id: faker.datatype.uuid(),
    title: faker.random.words(),
    description: null,
    listId: faker.datatype.uuid(),
  };

  describe("createCard test suite", () => {
    const createCard: CreateCardParams = {
      title: faker.random.words(),
      listId: faker.datatype.uuid(),
    };

    it("should be able to create card", async () => {
      const createCardActivityMock = jest
        .spyOn(cardActivityServices, "createCardActivity")
        .mockResolvedValue(undefined);

      jest
        .spyOn(cardsRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return {
            ...cardMock,
            title: createCard.title,
            listId: createCard.listId,
          };
        });

      const card = await cardsServices.createCard(cardMock, userId);

      expect(card).toStrictEqual({
        ...cardMock,
        title: createCard.title,
        listId: createCard.listId,
      });
      expect(createCardActivityMock).toHaveBeenCalledWith({
        cardId: card.id,
        actionPerformed: "created",
        performedBy: userId,
      });
    });
  });

  describe("getById test suite", () => {
    const cardId = faker.datatype.uuid();

    const cardMockWithActivityAndLabel = {
      ...cardMock,
      cardLabels: [
        {
          id: faker.datatype.uuid(),
          cardId: cardMock.id,
          labelId: faker.datatype.uuid(),
          createdAt: faker.datatype.datetime(),
          updatedAt: faker.datatype.datetime(),
        },
      ],
      activity: [
        {
          id: faker.datatype.uuid(),
          cardId: cardMock.id,
          actionPerformed: faker.random.word(),
          performedBy: faker.datatype.uuid(),
          createdAt: faker.datatype.datetime(),
          updatedAt: faker.datatype.datetime(),
        },
      ],
    };

    it("should throw error if given cardId is invalid", async () => {
      jest.spyOn(cardsRepository, "findById").mockReturnValueOnce(undefined);

      const promise = cardsServices.getById(cardId);

      expect(cardsRepository.findById).toBeCalledWith(cardId);
      expect(promise).rejects.toStrictEqual(CardNotFoundError());
    });

    it("should return a card with labels and activity if given cardId is valid", async () => {
      jest
        .spyOn(cardsRepository, "findById")
        .mockResolvedValueOnce(cardMockWithActivityAndLabel);

      const card = await cardsServices.getById(cardId);

      expect(cardsRepository.findById).toBeCalledWith(cardId);
      expect(card).toStrictEqual(cardMockWithActivityAndLabel);
    });
  });
});
