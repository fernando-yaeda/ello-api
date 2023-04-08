import { prisma } from "@/config";
import { Card, CardActivity, User } from "@prisma/client";
import { createUser } from "./users-factory";
import { createCard } from "./cards-factory";

export async function createCardActivity({
  user,
  card,
}: cardActivitiesFactoryParams): Promise<CardActivity> {
  const incomingUser = user || (await createUser());
  const incomingCard = card || (await createCard({}));

  return prisma.cardActivity.create({
    data: {
      actionPerformed: "created",
      cardId: incomingCard.id,
      performedBy: incomingUser.id,
    },
  });
}

type cardActivitiesFactoryParams = {
  card?: Card;
  user?: User;
};
