import { PrismaClient } from "@prisma/client";
import { colors } from "./colors";
import { Color } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "testing@testing.com" },
    update: {},
    create: {
      email: "testing@testing.com",
      username: "testing",
      password: "testing",
    },
  });

  colors.forEach((color) => {
    prisma.color.create(
        {data: color}
    );
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
