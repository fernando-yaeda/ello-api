import { faker } from "@faker-js/faker";

import cardActivityRepository from "@/repositories/cards-activities-repository";
import cardActivityServices from "@/services/card-activities-services";

describe("card-activity-services test suite", () => {
  describe("createCardActivity test suite", () => {
    const createActivityMock = {
      actionPerformed: "create",
      cardId: faker.datatype.uuid(),
      performedBy: faker.datatype.uuid(),
    };

    it("should return card activity object", async () => {
      jest
        .spyOn(cardActivityRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return {
            id: faker.datatype.uuid(),
            ...createActivityMock,
          };
        });

      const promise =
        cardActivityServices.createCardActivity(createActivityMock);

      expect(promise).resolves.toStrictEqual({
        id: expect.any(String),
        ...createActivityMock,
      });
    });
  });
});
