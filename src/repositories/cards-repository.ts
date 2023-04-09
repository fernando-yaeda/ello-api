import { prisma } from "@/config";
import { Card, CardActivity, CardLabel } from "@prisma/client";

async function create(data: CreateCardParams): Promise<Card> {
  return await prisma.card.create({
    data,
  });
}

async function findById(
  cardId: string
): Promise<Card & { cardLabels: CardLabel[]; activity: CardActivity[] }> {
  return await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      cardLabels: true,
      activity: true,
    },
  });
}

export type CreateCardParams = {
  title: string;
  listId: string;
};

const cardsRepository = {
  create,
  findById,
};

export default cardsRepository;
