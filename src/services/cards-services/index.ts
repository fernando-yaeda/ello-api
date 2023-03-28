import cardsRepository, {
  CreateCardParams,
} from "@/repositories/cards-repository";
import projectService from "../projects-services";
import listsServices from "../lists-services";
import cardActivityServices from "../card-activities-services";
import { Card } from "@prisma/client";
import { notAllowedError } from "./errors";

async function createCard(
  { title, listId }: CreateCardParams,
  userId: string
): Promise<Card> {
  const list = await listsServices.validateListOrFail(listId);

  const project = await projectService.validateProjectOrFail(list.projectId);

  if (project.ownerId !== userId) throw notAllowedError();

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
