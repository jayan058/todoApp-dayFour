import * as todosModels from "./../models/todos";
import { ITodo } from "./../interface/todo";
import { todos } from "./../models/todos";
import * as userModels from "../models/users";
import UnauthorizedError from "../error/unauthorizedError";
import NotFoundError from "../error/notFoundError";
import { NextFunction } from "express";
export async function getAllTodos(user: any) {
  let todos = todosModels.getAllTodos(user);
  if (todos) {
    return todos;
  } else {
    throw new NotFoundError("Todos Not Found");
  }
}
export async function addTodo(todo: ITodo, headers: any) {
  const userId = headers.id;
  const user = userModels.findUserById(userId);
  if (!user) {
    throw new NotFoundError("User Not Found");
  }
  let message = todosModels.createTodo(todo, user);
  return message;
}
export async function updateTodo(
  id: string,
  name: string,
  isDone: boolean,
  userId: string,
  next: NextFunction
) {
  const todo = todosModels.findTodoFromId(id);
  if (!todo) {
    throw new NotFoundError("Todo with that ID doesn't exist");
  }
  const foundUser = userModels.findUserById(userId);
  if (!foundUser) {
    throw new NotFoundError("User not found");
  }
  const todoIndex = todosModels.findIfTodoBelongsToUser(foundUser, id);
  if (todoIndex === -1) {
    throw new UnauthorizedError("Cannot update someone else's Todo");
  }
  todo.name = name;
  todo.isDone = isDone;
  return todo;
}
export async function deleteTodo(id: string, userId: string) {
  const todo = todosModels.findTodoFromId(id);
  if (!todo) {
    throw new NotFoundError("Todo with that ID doesn't exist");
  }
  const foundUser = userModels.findUserById(userId);
  if (!foundUser) {
    throw new NotFoundError("User not found");
  }
  const todoIndex = todosModels.findIfTodoBelongsToUser(foundUser, id);
  if (todoIndex === -1) {
    throw new UnauthorizedError("Cannot delete someone else's Todo");
  }
  foundUser.todos.splice(todoIndex, 1);
  const updatedTodos = todos.filter((t) => t.id !== id);
  todos.length = 0;
  todos.push(...updatedTodos);
  return "Successfully deleted Todo";
}
