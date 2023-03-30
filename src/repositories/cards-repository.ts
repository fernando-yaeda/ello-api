import { prisma } from "@/config";
import { Card } from "@prisma/client";

async function create(data: CreateCardParams): Promise<Card> {
  return await prisma.card.create({
    data,
  });
}

export type CreateCardParams = {
  title: string;
  listId: string;
};

const cardsRepository = {
  create,
};

export default cardsRepository;
