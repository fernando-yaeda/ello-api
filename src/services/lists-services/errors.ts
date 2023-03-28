import { ApplicationError } from "@/protocols";

export const NotAllowedErrorObject = {
  name: "NotAllowedError",
  message: "Not allowed to perform this action",
};

export function notAllowedError(): ApplicationError {
  return NotAllowedErrorObject;
}

export const ListNotFoundErrorObject = {
  name: "ListNotFoundError",
  message: "There is no list with given id",
};

export function listNotFoundError(): ApplicationError {
  return ListNotFoundErrorObject;
}
