import projectService from "../projects-services";
import participantServices from "../participant-services";
import listsServices from "../lists-services";
import cardActivityServices from "../card-activities-services";

import cardsRepository, {
  CreateCardParams,
} from "@/repositories/cards-repository";
import { Card } from "@prisma/client";

async function createCard(
  { title, listId }: CreateCardParams,
  userId: string
): Promise<Card> {
  const list = await listsServices.validateListOrFail(listId);
  await projectService.validateProjectOrFail(list.projectId);
  await participantServices.validateParticipant(userId, list.projectId);

  const card = await cardsRepository.create({
    title,
    listId,
  });

  const action = "created";

  await cardActivityServices.createCardActivity({
    cardId: card.id,
    actionPerformed: action,
    performedBy: userId,
  });

  return card;
}

const cardServices = {
  createCard,
};

export * from "./errors";
export default cardServices;
