import { faker } from "@faker-js/faker";

export const invalidBodyDataSet = [
  {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    [faker.random.word()]: faker.random.word(),
  },
  {
    [faker.random.word()]: faker.random.word(),
  },
  {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    [faker.random.word()]: faker.random.word(),
  },
];
