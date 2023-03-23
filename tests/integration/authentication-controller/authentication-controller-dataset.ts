import { faker } from "@faker-js/faker";

export const invalidBodyDataSet = [
  {
    email: faker.internet.email(),
    password: faker.internet.userName(),
    [faker.random.word()]: faker.random.word(),
  },
  {
    [faker.random.word()]: faker.random.word(),
  },
];
