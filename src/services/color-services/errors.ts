import { ApplicationError } from "@/protocols";

export function colorNotFoundError(): ApplicationError {
  return {
    name: "ColorNotFoundError",
    message: "There is no color with given colorName",
  };
}
