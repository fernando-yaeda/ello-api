import projectsRepository, {
  CreateProjectParams,
} from "@/repositories/projects-repository";
import { Project } from "@prisma/client";
import { projectNotFoundError } from "./errors";

async function createProject({
  name,
  ownerId,
}: CreateProjectParams): Promise<Project> {
  return await projectsRepository.create({
    name,
    ownerId,
  });
}

async function validateProjectOrFail(
  projectId: string
): Promise<Project | null> {
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
