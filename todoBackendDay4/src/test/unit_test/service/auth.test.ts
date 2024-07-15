import * as authService from "../../../services/auth";
import * as userModels from "../../../models/users";
import NotFoundError from "../../../error/notFoundError";
import UnauthorizedError from "../../../error/unauthorizedError";
import ForbiddenError from "../../../error/forbiddenError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import sinon from "sinon";
import expect from "expect";
import { permission } from "process";

describe("Auth Service Test Suite", () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = {
      cookie: sandbox.stub(),
      status: sandbox.stub().returns({ json: sandbox.stub() }),
    } as unknown as Response;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("login", () => {
    it("should throw NotFoundError if email does not exist", async () => {
      const email = "nonexistent@example.com";
      const password = "password123";

      sandbox.stub(userModels, "findUserByEmail").returns(null);

      await expect(authService.login(email, password, res)).rejects.toThrow(
        new NotFoundError("No Matching Email")
      );
    });

    it("should throw UnauthorizedError if password does not match", async () => {
      const email = "john@example.com";
      const password = "wrongpassword";
      const user = {
        id: "1",
        name: "John Doe",
        email,
        password: "hashedpassword123",
        permission: ["user"],
      };

      sandbox.stub(userModels, "findUserByEmail").returns(user);
      sandbox.stub(bcrypt, "compare").resolves(false);

      await expect(authService.login(email, password, res)).rejects.toThrow(
        new UnauthorizedError("Passwords Don't Match")
      );
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify refresh token successfully", async () => {
      const token = "validToken";
      const user = { id: "1", name: "John Doe" };

      sandbox
        .stub(jwt, "verify")
        .callsFake((token, secret, callback) => callback(null, user));

      const result = await authService.verifyRefreshToken(token);

      expect(result).toEqual(user);
    });

    it("should throw ForbiddenError if refresh token is invalid", async () => {
      const token = "invalidToken";

      sandbox
        .stub(jwt, "verify")
        .callsFake((token, secret, callback) => callback(new Error()));

      await expect(authService.verifyRefreshToken(token)).rejects.toThrow(
        new ForbiddenError("Invalid refresh token")
      );
    });
  });

  describe("isRefreshTokenValid", () => {
    it("should return true if refresh token is valid", async () => {
      const token = "validToken";
      authService.refreshTokens.push(token);

      const result = await authService.isRefreshTokenValid(token);

      expect(result).toBe(true);
    });

    it("should throw ForbiddenError if refresh token is invalid", async () => {
      const token = "invalidToken";
      authService.refreshTokens.push(token);

      expect(() => authService.isRefreshTokenValid(token)).rejects.toThrow(
        new ForbiddenError("Invalid refresh token")
      );
    });
  });
});
