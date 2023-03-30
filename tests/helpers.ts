import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { createUser, createSession } from "./factories";
import { prisma } from "@/config";

export async function cleanDb() {
  await prisma.cardLabel.deleteMany({});
  await prisma.color.deleteMany({});
  await prisma.label.deleteMany({});
  await prisma.cardActivity.deleteMany({});
  await prisma.card.deleteMany({});
  await prisma.list.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
