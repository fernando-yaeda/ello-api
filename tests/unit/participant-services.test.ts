import { faker } from "@faker-js/faker";

import participantsRepository from "@/repositories/participants-repository";
import participantServices, {
  notParticipantError,
} from "@/services/participant-services";

describe("participant-services test suite", () => {
  describe("validateParticipant test suite", () => {
    const participantMock = {
      userId: faker.datatype.uuid(),
      projectId: faker.datatype.uuid(),
    };

    it("should throw not participant error if user is not a project participant", async () => {
      jest
        .spyOn(participantsRepository, "findByIndex")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return;
        });

      const promise = participantServices.validateParticipant(
        participantMock.userId,
        participantMock.projectId
      );

      expect(promise).rejects.toStrictEqual(notParticipantError());
    });

    it("should not throw error if user is a project participant", async () => {
      jest
        .spyOn(participantsRepository, "findByIndex")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return {
            id: faker.datatype.uuid(),
            isAdmin: faker.datatype.boolean(),
            ...participantMock,
          };
        });

      const promise = participantServices.validateParticipant(
        participantMock.userId,
        participantMock.projectId
      );

      expect(promise).resolves.toStrictEqual({
        id: expect.any(String),
        isAdmin: expect.any(Boolean),
        ...participantMock,
      });
    });
  });
});
