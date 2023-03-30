import { faker } from "@faker-js/faker";
import cardActivityRepository, {
  CreateCardActivityParams,
} from "@/repositories/cards-activities-repository";
import cardActivityServices from "@/services/card-activities-services";

describe("cards-service test suite", () => {
  describe("createCard test suite", () => {
    const cardActivityMock: CreateCardActivityParams = {
      actionPerformed: faker.random.words(),
      cardId: faker.datatype.uuid(),
      performedBy: faker.datatype.uuid(),
    };

    const dateMock = faker.datatype.datetime();

    const idMock = faker.datatype.uuid();

    it("should create card activity", async () => {
      jest
        .spyOn(cardActivityRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return {
            ...cardActivityMock,
            id: idMock,
            createdAt: dateMock,
          };
        });

      const promise = cardActivityServices.createCardActivity(cardActivityMock);

      expect(promise).resolves.toStrictEqual({
        id: idMock,
        createdAt: dateMock,
        actionPerformed: cardActivityMock.actionPerformed,
        cardId: cardActivityMock.cardId,
        performedBy: cardActivityMock.performedBy,
      });
    });
  });
});
