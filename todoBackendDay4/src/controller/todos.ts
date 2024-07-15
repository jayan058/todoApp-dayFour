import { NextFunction, Request, Response } from "express";
import * as todoServices from "./../services/todos";
interface AuthenticatedRequest extends Request {
  user?: { id: string; name: string; email: string };
}
export async function getAllTodos(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let data =await todoServices.getAllTodos(req.user);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
export async function addTodo(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { body, user } = req;
    let data =await todoServices.addTodo(body, user);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
export async function updateTodo(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const { name, isDone } = req.body;
    const userId = req.user!.id;
    const message =await todoServices.updateTodo(id, name, isDone, userId, next);
    res.json({ message });
  } catch (error) {
    next(error);
  }
}
export async function deleteTodo(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const userId = req.user!.id;
    let message =await todoServices.deleteTodo(id, userId);
    res.json(message);
  } catch (error) {
    next(error);
  }
}
