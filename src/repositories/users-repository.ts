import { prisma } from "@/config";
import { Prisma, User } from "@prisma/client";

async function create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
  return prisma.user.create({
    data,
  });
}

async function findByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function findById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

const usersRepository = {
  create,
  findById,
  findByEmail,
};

export default usersRepository;
