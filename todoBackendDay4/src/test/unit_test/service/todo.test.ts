import * as todosService from "../../../services/todos";
import * as todosModels from "../../../models/todos";
import * as userModels from "../../../models/users";
import UnauthorizedError from "../../../error/unauthorizedError";
import NotFoundError from "../../../error/notFoundError";
import { NextFunction } from "express";
import { ITodo } from "../../../interface/todo";
import sinon from "sinon";
import expect from "expect";

describe("Todos Service Test Suite", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("getAllTodos", () => {
    it("should return all todos for a user", async () => {
      const user = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        todos: ["1"],
      };

      const todos = {
        id: "1",
        name: "todo2",
        isDone: false,
      };
      sandbox.stub(todosModels, "getAllTodos").returns(todos);
      const result = await todosService.getAllTodos(user);
      expect(result).toEqual(todos);
    });

    it("should throw NotFoundError if user is not found", async () => {
      let empty = [];
      const user = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        todos: ["1"],
      };
      sandbox.stub(todosModels, "getAllTodos").returns(null);
      await expect(todosService.getAllTodos(user)).rejects.toThrow(
        new NotFoundError("Todos Not Found")
      );
    });
  });

  describe("addTodo", () => {
    it("should add a new todo for a user", async () => {
      const todo: ITodo = { name: "Task 1", isDone: false };
      const headers = { id: "1" };
      const user = { id: "1", name: "John Doe", email: "john@example.com" };
      sandbox.stub(userModels, "findUserById").returns(user);
      sandbox.stub(todosModels, "createTodo").returns(todo);

      const result = await todosService.addTodo(todo, headers.id);
      expect(result).toBe(todo);
    });

    it("should throw NotFoundError if user is not found", async () => {
      sandbox.stub(userModels, "findUserById").returns(null);

      expect(
        async () =>
          await todosService.addTodo(
            { name: "Task 1", isDone: false },
            { id: "1" }
          )
      ).rejects.toThrow(new NotFoundError("User not found"));
    });
  });

  describe("updateTodo", () => {
    it("should update the todo successfully", async () => {
      const todo = { id: "1", name: "Task 1", isDone: false };
      const userId = "1";
      const next: NextFunction = () => {};

      sandbox.stub(todosModels, "findTodoFromId").returns(todo);
      sandbox.stub(userModels, "findUserById").returns({
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        password: "john",
        todos: [],
      });
      sandbox.stub(todosModels, "findIfTodoBelongsToUser").returns(0);

      const result = await todosService.updateTodo(
        todo.id,
        "Updated Task 1",
        true,
        userId,
        next
      );
      expect(result).toEqual({ ...todo, name: "Updated Task 1" });
    });

    it("should throw NotFoundError if todo is not found", () => {
      sandbox.stub(todosModels, "findTodoFromId").returns(null);

      expect(
        async () =>
          await todosService.updateTodo(
            "1",
            "Updated Task 1",
            true,
            "1",
            () => {}
          )
      ).rejects.toThrow(new NotFoundError("Todo with that ID doesn't exist"));
    });

    it("should throw NotFoundError if user is not found", () => {
      sandbox
        .stub(todosModels, "findTodoFromId")
        .returns({ id: "1", name: "Task 1", isDone: false });
      sandbox.stub(userModels, "findUserById").returns(null);

      expect(
        async () =>
          await todosService.updateTodo(
            "1",
            "Updated Task 1",
            true,
            "1",
            () => {}
          )
      ).rejects.toThrow(new NotFoundError("User not found"));
    });

    it("should throw UnauthorizedError if user tries to update someone else's todo", () => {
      sandbox
        .stub(todosModels, "findTodoFromId")
        .returns({ id: "1", name: "Task 1", isDone: false });
      sandbox.stub(userModels, "findUserById").returns({
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        permissions: [],
        todos: [2],
      });

      expect(
        async () =>
          await todosService.updateTodo(
            "1",
            "Updated Task 1",
            true,
            "1",
            () => {}
          )
      ).rejects.toThrow(
        new UnauthorizedError("Cannot update someone else's Todo")
      );
    });
  });

  describe("deleteTodo", () => {
    it("should delete the todo successfully", async () => {
      const todo = { id: "1", name: "Task 1", isDone: false };
      const userId = "1";
      const todos = [todo];

      sandbox.stub(todosModels, "findTodoFromId").returns(todo);
      sandbox.stub(userModels, "findUserById").returns({
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        todos: ["1"],
        permission: [],
      });
      sandbox.stub(todosModels, "findIfTodoBelongsToUser").returns(0);

      const result = await todosService.deleteTodo("1", "1");
      expect(result).toBe("Successfully deleted Todo");
    });

    it("should throw NotFoundError if todo is not found", () => {
      sandbox.stub(todosModels, "findTodoFromId").returns(null);

      expect(
        async () => await todosService.deleteTodo("1", "1")
      ).rejects.toThrow(new NotFoundError("Todo with that ID doesn't exist"));
    });

    it("should throw NotFoundError if user is not found", () => {
      sandbox
        .stub(todosModels, "findTodoFromId")
        .returns({ id: "1", name: "Task 1", isDone: false, userId: "1" });
      sandbox.stub(userModels, "findUserById").returns(null);

      expect(
        async () => await todosService.deleteTodo("1", "1")
      ).rejects.toThrow(new NotFoundError("User not found"));
    });

    it("should throw UnauthorizedError if user tries to delete someone else's todo", () => {
      sandbox
        .stub(todosModels, "findTodoFromId")
        .returns({ id: "1", name: "Task 1", isDone: false, userId: "2" });
      sandbox
        .stub(userModels, "findUserById")
        .returns({ id: "1", name: "John Doe", email: "john@example.com" });

      expect(() => todosService.deleteTodo("1", "1")).rejects.toThrow(
        new UnauthorizedError("Cannot delete someone else's Todo")
      );
    });
  });
});
