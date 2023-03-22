import authenticationServices, {
  invalidCredentialsError,
  SignInParams,
} from "@/services/authentication-services";
import usersRepository from "@/repositories/users-repository";
import sessionsRepository from "@/repositories/sessions-repository";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("authentication-services test suite", () => {
  describe("signIn test suite", () => {
    const signInMock: SignInParams = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    it("should throw invalid credentials error given wrong email", async () => {
      jest
        .spyOn(usersRepository, "findByEmail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return null;
        });

      const promise = authenticationServices.signIn(signInMock);

      expect(promise).rejects.toStrictEqual(invalidCredentialsError());
    });

    it("should throw invalid credentials error given wrong password", async () => {
      const existingUser = {
        id: faker.datatype.uuid(),
        fullName: faker.internet.userName(),
        email: signInMock.email,
      };

      jest
        .spyOn(usersRepository, "findByEmail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return existingUser;
        });

      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

      const promise = authenticationServices.signIn(signInMock);

      expect(promise).rejects.toStrictEqual(invalidCredentialsError());
    });

    it("should be able to sign in given valid credentials", async () => {
      const existingUser = {
        id: faker.datatype.uuid(),
        fullName: faker.internet.userName(),
        email: signInMock.email,
      };

      const jwtString = faker.datatype.string();

      jest
        .spyOn(usersRepository, "findByEmail")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return existingUser;
        });

      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      jwt.sign = jest.fn().mockReturnValueOnce(jwtString);

      jest
        .spyOn(sessionsRepository, "create")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return {
            jwtString,
          };
        });

      const promise = authenticationServices.signIn(signInMock);

      expect(promise).resolves.toStrictEqual({
        user: {
          id: existingUser.id,
          fullName: existingUser.fullName,
          email: existingUser.email,
        },
        token: jwtString,
      });
    });
  });

  describe("findSession test suite", () => {
    it("should return null given an invalid token", async () => {
      const invalidToken = faker.datatype.string();

      jest
        .spyOn(sessionsRepository, "findByToken")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return null;
        });

      const promise = authenticationServices.findSession(invalidToken);

      expect(promise).resolves.toBeNull();
    });

    it("should return a session given a valid token", async () => {
      const existingSession = {
        id: faker.datatype.uuid(),
        userId: faker.datatype.uuid(),
        token: faker.datatype.string(),
      };

      jest
        .spyOn(sessionsRepository, "findByToken")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementationOnce((): any => {
          return existingSession;
        });

      const promise = authenticationServices.findSession(existingSession.token);

      expect(promise).resolves.toStrictEqual(existingSession);
    });
  });
});
