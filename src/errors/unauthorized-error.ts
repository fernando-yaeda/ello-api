import { ApplicationError } from "@/protocols";

export function unauthorizedError(): ApplicationError {
  console.log("testing unauthorized error");
  return {
    name: "UnauthorizedError",
    message: "You need to authenticate to access this content",
  };
}
