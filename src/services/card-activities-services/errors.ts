import { ApplicationError } from "@/protocols";

export const NotAllowedErrorObject = {
  name: "NotAllowedError",
  message: "Not allowed to perform this action",
};

export function notAllowedError(): ApplicationError {
  return NotAllowedErrorObject;
}
