import * as userService from "../../../services/user";
import * as userModels from "../../../models/users";
import ConflictError from "../../../error/conflictError";
import NotFoundError from "../../../error/notFoundError";
import ValidationError from "../../../error/validationError";
import bcrypt from "bcrypt";
import expect from "expect";
import sinon from "sinon";

describe("User Service Test Suite", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("createUser", () => {
    it("should create a new user successfully", async () => {
      const name = "John Doe";
      const email = "john@example.com";
      const password = "password123";
      const hashedPassword = "hashedpassword123";

      sandbox.stub(userModels, "findUserByEmail").returns(null);
      sandbox.stub(bcrypt, "hash").resolves(hashedPassword);
      sandbox
        .stub(userModels, "createUser")
        .returns({ name, email, password: hashedPassword });

      const result = await userService.createUser(name, password, email);
      expect(result).toEqual({ name, email, password: hashedPassword });
    });

    it("should throw ConflictError if email is already taken", async () => {
      sandbox.stub(userModels, "findUserByEmail").returns(true);

      await expect(
        userService.createUser("John Doe", "password123", "john@example.com")
      ).rejects.toThrow(new ConflictError("Email already taken"));
    });

    it("should throw ValidationError if an error occurs while creating user", async () => {
      sandbox.stub(userModels, "findUserByEmail").returns(null);
      sandbox.stub(bcrypt, "hash").rejects(new Error());

      await expect(
        userService.createUser("John Doe", "password123", "john@example.com")
      ).rejects.toThrow(new ValidationError("Error creating user", " "));
    });
  });

  describe("findUserById", () => {
    it("should return the user if found", async () => {
      const user = { id: "1", name: "John Doe", email: "john@example.com" };
      sandbox.stub(userModels, "findUserById").returns(user);

      const result = await userService.findUserById("1");
      expect(result).toEqual(user);
    });

    it("should throw NotFoundError if user is not found", async () => {
      sandbox.stub(userModels, "findUserById").returns(null);

      await expect(userService.findUserById("1")).rejects.toThrow(
        new NotFoundError("No user with that id")
      );
    });
  });

  describe("getUsers", () => {
    it("should return all users", async () => {
      const users = [{ id: "1", name: "John Doe", email: "john@example.com" }];
      sandbox.stub(userModels, "getUsers").returns(users);

      const result = await userService.getUsers();
      expect(result).toEqual(users);
    });

    it("should throw NotFoundError if no users are found", () => {
      sandbox.stub(userModels, "getUsers").returns(false);

      expect(async () => await userService.getUsers()).rejects.toThrow(
        new NotFoundError("No users created to show")
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete the user successfully", async () => {
      const user = { id: "1", name: "John Doe", email: "john@example.com" };
      sandbox.stub(userModels, "findUserById").returns(user);
      const deleteStub = sandbox.stub(userModels, "deleteUser");

      const result = await userService.deleteUser("1");
      expect(deleteStub.calledOnceWith(user)).toBe(true);
      expect(result).toBe("Successfully deleted user");
    });

    it("should throw NotFoundError if user is not found", () => {
      sandbox.stub(userModels, "findUserById").returns(false);

      expect(async () => await userService.deleteUser("1")).rejects.toThrow(
        new NotFoundError("No users with that ID")
      );
    });
  });

  describe("updateUser", () => {
    it("should update the user successfully", async () => {
      const user = { id: "1", name: "John Doe", email: "john@example.com" };
      const hashedPassword = "hashedpassword123";

      sandbox.stub(userModels, "findUserById").returns(user);
      sandbox.stub(userModels, "findUserByEmail").returns(null);
      sandbox.stub(bcrypt, "hash").resolves(hashedPassword);
      sandbox.stub(userModels, "updateUser").returns({
        ...user,
        email: "newemail@example.com",
        password: hashedPassword,
      });

      const result = await userService.updateUser(
        "newemail@example.com",
        "newpassword",
        "1"
      );
      expect(result).toEqual({
        ...user,
        email: "newemail@example.com",
        password: hashedPassword,
      });
    });

    it("should throw NotFoundError if user is not found", async () => {
      sandbox.stub(userModels, "findUserById").returns(null);

      await expect(
        userService.updateUser("newemail@example.com", "newpassword", "1")
      ).rejects.toThrow(new NotFoundError("No user with that ID"));
    });

    it("should throw ConflictError if new email is already taken by another user", async () => {
      const user = { id: "1", name: "John Doe", email: "john@example.com" };
      const existingUser = {
        id: "2",
        name: "Jane Doe",
        email: "newemail@example.com",
      };

      sandbox.stub(userModels, "findUserById").returns(user);
      sandbox.stub(userModels, "findUserByEmail").returns(existingUser);

      await expect(
        userService.updateUser("newemail@example.com", "newpassword", "1")
      ).rejects.toThrow(new ConflictError("Email already taken"));
    });
  });
});
