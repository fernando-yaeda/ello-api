import usersRepository from "@/repositories/users-repository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { duplicatedEmailError } from "./errors";

async function createUser({
  email,
  username,
  password,
}: CreateUserParams): Promise<User> {
  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 8);

  return usersRepository.create({
    email,
    username,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string): Promise<void> {
  const userWithSameEmail = await usersRepository.findByEmail(email);

  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

export type CreateUserParams = Pick<User, "email" | "username" | "password">;

const userService = {
  createUser,
};

export * from "./errors";
export default userService;
