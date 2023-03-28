import cardActivityRepository, {
  CreateCardActivityParams,
} from "@/repositories/cards-activities-repository";
import { CardActivity } from "@prisma/client";

async function createCardActivity(
  CreateCardActivityParams: CreateCardActivityParams
): Promise<CardActivity> {
  return await cardActivityRepository.create(CreateCardActivityParams);
}

const cardActivityServices = {
  createCardActivity,
};

export * from "./errors";
export default cardActivityServices;
