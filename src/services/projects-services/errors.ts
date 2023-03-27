import { ApplicationError } from "@/protocols";

export const ProjectNotFoundErrorObject = {
  name: "ProjectNotFoundError",
  message: "There is no project with given id",
};

export function projectNotFoundError(): ApplicationError {
  return ProjectNotFoundErrorObject;
}
