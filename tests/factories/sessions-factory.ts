import { prisma } from "@/config";
import { Session } from "@prisma/client";
import { createUser } from "./";

export async function createSession(token: string): Promise<Session> {
  const user = await createUser();

  return prisma.session.create({
    data: {
      userId: user.id,
      token: token,
    },
  });
}
