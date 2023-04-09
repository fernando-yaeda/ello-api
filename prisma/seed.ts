import { PrismaClient } from "@prisma/client";
import { colors } from "./colors";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "testing@testing.com" },
    update: {},
    create: {
      email: "testing@testing.com",
      username: "testing",
      password: "testing",
    },
  });

  colors.forEach(async (color) => {
    await prisma.color.upsert({
      where: { name: color.name },
      update: color,
      create: color,
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
