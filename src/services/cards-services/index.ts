import cardActivityServices from "../card-activities-services";

import cardsRepository, {
  CreateCardParams,
} from "@/repositories/cards-repository";
import { Card, CardActivity, CardLabel } from "@prisma/client";
import { CardNotFoundError } from "./errors";

async function createCard(
  { title, listId }: CreateCardParams,
  userId: string
): Promise<Card> {
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

async function getById(
  cardId: string
): Promise<Card & { cardLabels: CardLabel[]; activity: CardActivity[] }> {
  const card = await cardsRepository.findById(cardId);

  if (!card) throw CardNotFoundError();

  return card;
}

const cardServices = {
  createCard,
  getById,
};

export * from "./errors";
export default cardServices;
