import { ApplicationError } from "@/protocols";

import projectsRepository, {
  CreateProjectParams,
} from "@/repositories/projects-repository";
import { Participant, Project } from "@prisma/client";
import { projectNotFoundError } from "./errors";

async function createProject({
  name,
  ownerId,
}: CreateProjectParams): Promise<Project & { participants: Participant[] }> {
  const project = await projectsRepository.create({
    name,
    ownerId,
  });

  return project;
}

async function validateProjectOrFail(
  projectId: string
): Promise<Project | ApplicationError> {
  const project = await projectsRepository.findById(projectId);

  if (!project) throw projectNotFoundError();

  return project;
}

const projectService = {
  createProject,
  validateProjectOrFail,
};

export * from "./errors";
export default projectService;
