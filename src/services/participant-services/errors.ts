import { ApplicationError } from "@/protocols";

export function notParticipantError(): ApplicationError {
  return {
    name: "NotParticipantError",
    message: "You are not a participant on this project.",
  };
}
