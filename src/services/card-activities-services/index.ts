import cardActivityRepository, {
  CreateCardActivityParams,
} from "@/repositories/cards-activities-repository";
import { CardActivity } from "@prisma/client";

async function createCardActivity(
  CreateCardActivityParams: CreateCardActivityParams
): Promise<CardActivity> {
  const cardActivity = await cardActivityRepository.create(
    CreateCardActivityParams
  );

  return cardActivity;
}

const cardActivityServices = {
  createCardActivity,
};

export * from "./errors";
export default cardActivityServices;
