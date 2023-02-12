import { prisma } from "@/config";
import { Prisma, Session } from "@prisma/client";

async function create(
  data: Prisma.SessionUncheckedCreateInput
): Promise<Session> {
  return prisma.session.create({
    data,
  });
}

async function findByToken(token: string): Promise<Session | null> {
  return await prisma.session.findFirst({
    where: {
      token,
    },
  });
}

const sessionsRepository = {
  create,
  findByToken,
};

export default sessionsRepository;
