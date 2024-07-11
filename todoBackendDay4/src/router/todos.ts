import express from "express";
import * as todosController from "../controller/todos";
import { authenticate } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validation";
import {
  createTodoSchema,
  updateTodoSchema,
  todoIdSchema,
} from "../schema/todo";

const todoRoute = express();

todoRoute.get("/", authenticate, todosController.getAllTodos);

todoRoute.post(
  "/addTodos",
  authenticate,
  validateBody(createTodoSchema),
  todosController.addTodo
);

todoRoute.put(
  "/updateTodos/:id",
  authenticate,
  validateParams(todoIdSchema),
  validateBody(updateTodoSchema),
  todosController.updateTodo
);

todoRoute.delete(
  "/deleteTodos/:id",
  authenticate,
  validateParams(todoIdSchema),
  todosController.deleteTodo
);

export default todoRoute;
