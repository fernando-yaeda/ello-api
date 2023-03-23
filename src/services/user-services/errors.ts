import { ApplicationError } from "@/protocols";

export const DuplicatedEmailErrorObject = {
  name: "DuplicatedEmailError",
  message: "There is already an user with given email",
};

export function duplicatedEmailError(): ApplicationError {
  return DuplicatedEmailErrorObject;
}
