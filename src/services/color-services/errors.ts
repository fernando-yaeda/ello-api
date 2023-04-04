import { ApplicationError } from "@/protocols";

export function colorNotFoundError(): ApplicationError {
  return {
    name: "ColorNotFoundError",
    message: "There is no list with given id",
  };
}
