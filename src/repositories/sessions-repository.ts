import { prisma } from "@/config";
import { Prisma, Session } from "@prisma/client";

async function create(
  data: Prisma.SessionUncheckedCreateInput
): Promise<Session> {
  return prisma.session.create({
    data,
  });
}

const sessionsRepository = {
  create,
};

export default sessionsRepository;
