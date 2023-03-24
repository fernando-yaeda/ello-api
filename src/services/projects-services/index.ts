import projectsRepository, {
  CreateProjectParams,
} from "@/repositories/projects-repository";
import { Project } from "@prisma/client";

async function createProject({
  name,
  ownerId,
}: CreateProjectParams): Promise<Project> {
  return await projectsRepository.create({
    name,
    ownerId,
  });
}

const projectService = {
  createProject,
};

export * from "./errors";
export default projectService;
