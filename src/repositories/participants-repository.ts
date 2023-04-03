import { prisma } from "@/config";
import { Participant } from "@prisma/client";

async function findByIndex(
  userId: string,
  projectId: string
): Promise<Participant> {
  return await prisma.participant.findUnique({
    where: {
      userId_projectId: {
        userId: userId,
        projectId: projectId,
      },
    },
  });
}

const participantsRepository = {
  findByIndex,
};

export default participantsRepository;
