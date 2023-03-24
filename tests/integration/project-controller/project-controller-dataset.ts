import { faker } from "@faker-js/faker";

export const invalidBodyDataSet = [
  {
    name: faker.random.words(),
    ownerId: faker.datatype.uuid(),
    [faker.random.word()]: faker.random.word(),
  },
  {
    [faker.random.word()]: faker.random.word(),
  },
  {
    name: faker.random.words(),
    [faker.random.word()]: faker.random.word(),
  },
  {
    ownerId: faker.datatype.uuid(),
    [faker.random.word()]: faker.random.word(),
  },
];
