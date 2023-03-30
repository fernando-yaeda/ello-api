import { prisma } from "@/config";
import { CardActivity } from "@prisma/client";

async function create(data: CreateCardActivityParams): Promise<CardActivity> {
  return await prisma.cardActivity.create({
    data,
  });
}

export type CreateCardActivityParams = {
  actionPerformed: string;
  cardId: string;
  performedBy: string;
};

const cardActivityRepository = {
  create,
};

export default cardActivityRepository;
