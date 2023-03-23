import userService, {
  CreateUserParams,
  duplicatedEmailError,
} from "@/services/user-services";
import usersRepository from "@/repositories/users-repository";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

describe("user-service test suite", () => {
  describe("createUser test suite", () => {
    const userMock: CreateUserParams = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };

    it("should throw dupicated email error if email is already in use", async () => {
      jest
        .spyOn(usersRepository, "findByEmail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return {
            id: faker.datatype.uuid(),
            email: userMock.email,
            username: faker.internet.userName(),
            password: faker.internet.password(),
          };
        });

      const promise = userService.createUser(userMock);

      expect(promise).rejects.toEqual(duplicatedEmailError());
    });

    it("should be able to create an user", async () => {
      const mockHashedPassword = faker.datatype.string();

      bcrypt.hash = jest.fn().mockResolvedValue(mockHashedPassword);

      jest
        .spyOn(usersRepository, "findByEmail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return null;
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(usersRepository, "create").mockImplementationOnce((): any => {
        return {
          ...userMock,
          password: mockHashedPassword,
        };
      });

      const promise = userService.createUser(userMock);

      expect(promise).resolves.toEqual({
        ...userMock,
        password: mockHashedPassword,
      });
    });
  });
});
