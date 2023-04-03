import participantsRepository from "@/repositories/participants-repository";
import { Participant } from "@prisma/client";
import { notParticipantError } from "./errors";

async function validateParticipant(
  userId: string,
  projectId: string
): Promise<Participant> {
  const isParticipant = await participantsRepository.findByIndex(
    userId,
    projectId
  );

  if (!isParticipant) throw notParticipantError();

  return isParticipant;
}

const participantServices = {
  validateParticipant,
};

export * from "./errors";
export default participantServices;
