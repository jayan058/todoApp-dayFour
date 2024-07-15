import * as userModels from "../models/users";
import ConflictError from "../error/conflictError";
import bcrypt from "bcrypt";
import NotFoundError from "../error/notFoundError";
import ValidationError from "../error/validationError";
import { User } from "../interface/user";
import { BCRYPT_SALT_ROUNDS } from "../constants";

export async function createUser(
  name: string,
  password: string,
  email: string
) {
  if (userModels.findUserByEmail(email)) {
    throw new ConflictError("Email already taken");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    let data = userModels.createUser(name, hashedPassword, email);
    return data;
  } catch (error) {
    throw new ValidationError("Error creating user", " ");
  }
}

export async function findUserById(id: string) {
  let foundUser = userModels.findUserById(id);
  if (!foundUser) {
    throw new NotFoundError("No user with that id");
  }
  return foundUser;
}

export async function getUsers() {
  let users = userModels.getUsers();
  if (!users) {
    throw new NotFoundError("No users created to show");
  }
  return users;
}

export async function deleteUser(id: string) {
  let foundUser = userModels.findUserById(id);
  if (!foundUser) {
    throw new NotFoundError("No user with that id");
  }
  userModels.deleteUser(foundUser);
  return "Successfully deleted user";
}

export async function updateUser(email: string, password: string, id: string) {
  let foundUser = userModels.findUserById(id);
  if (!foundUser) {
    throw new NotFoundError("No user with that ID");
  }

  const existingUser = userModels.findUserByEmail(email);
  if (existingUser && existingUser.id !== foundUser.id) {
    throw new ConflictError("Email already taken");
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  let data = userModels.updateUser(foundUser, email, hashedPassword);
  return data;
}

export function add(a, b) {
  return a + b;
}
