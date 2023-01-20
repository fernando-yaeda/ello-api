import sessionsRepository from "@/repositories/sessions-repository";
import usersRepository from "@/repositories/users-repository";
import { exclude } from "@/utils/prisma-utils";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "./errors";

async function signIn({
  email,
  password,
}: SignInParams): Promise<SignInResult> {
  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, "password", "fullName"),
    token,
  };
}

async function getUserOrFail(email: string): Promise<User> {
  const user = await usersRepository.findByEmail(email);

  if (!user) {
    throw invalidCredentialsError();
  }

  return user;
}

async function validatePasswordOrFail(
  password: string,
  userPassword: string
): Promise<void> {
  const isPasswordValid = await bcrypt.compare(password, userPassword);

  if (!isPasswordValid) {
    throw invalidCredentialsError();
  }
}

async function createSession(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  await sessionsRepository.create({
    token,
    userId,
  });

  return token;
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

const authenticationServices = {
  signIn,
};

export * from "./errors";
export default authenticationServices;
