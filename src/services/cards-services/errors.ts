import { ApplicationError } from "@/protocols";

export function CardNotFoundError(): ApplicationError {
  return {
    name: "CardNotFoundError",
    message: "Could not find a card with the given id",
  };
}
