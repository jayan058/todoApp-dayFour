import { NextFunction, Request, Response } from "express";
import * as userServices from "../services/user";
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, password, email } = req.body;
    const message = await userServices.createUser(name, password, email);
    res.json(message);
  } catch (error) {
    next(error);
  }
}
export async function fetchUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const message = await userServices.findUserById(id);
    res.json(message);
  } catch (error) {
    next(error);
  }
}
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const message = userServices.getUsers();
    res.json(message);
  } catch (error) {
    next(error);
  }
}
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const message = userServices.deleteUser(id);
    res.json(message);
  } catch (error) {
    next(error);
  }
}
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const { email, password } = req.body;
    const message = await userServices.updateUser(email, password, id);
    res.json(message);
  } catch (error) {
    next(error);
  }
}
