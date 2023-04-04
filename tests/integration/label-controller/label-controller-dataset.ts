import { faker } from "@faker-js/faker";

export const invalidBodyDataSet = [
  {
    title: faker.random.words(),
    colorName: faker.random.words(),
    [faker.random.word()]: faker.random.word(),
  },
  {
    title: faker.random.words(),
    [faker.random.word()]: faker.random.word(),
    projectId: faker.datatype.uuid(),
  },
  {
    [faker.random.word()]: faker.random.word(),
    colorName: faker.random.words(),
    projectId: faker.datatype.uuid(),
  },
];
