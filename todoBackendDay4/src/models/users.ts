import { User } from "../interface/user";
export type users = {
  id: string;
  name: string;
  password: string;
  email: string;
  todos: string[];
  permission: string[];
};
export let users: users[] = [
  {
    id: "1",
    name: "jayan",
    password: "$2b$10$z/92iZB5uuHVB.5Nwa2DRuV/VCSS8jZMTAnV.IcZzbWm7Jqn7rjMK",
    email: "jayan@jayan.com",
    todos: ["1"],
    permission: ["super admin"],
  },
  {
    id: "2",
    name: "jaya",
    password: "$2b$10$rjCKr1R6cwFFLsr5ohc64u.LbM6SXyzI.I/8fb1Nid5RQQtw2KBUK",
    email: "jaya@jaya.com",
    todos: ["2"],
    permission: [],
  },
];
export function createUser(name: string, password: string, email: string) {
  const id = (users.length + 1).toString();
  const newUser: users = {
    id,
    name,
    password,
    email,
    todos: [],
    permission: [],
  };
  users.push(newUser);
  return newUser;
}
export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email);
}
export function findUserById(id: string) {
  return users.find((user) => user.id == id);
}
export function getUsers() {
  return users;
}
export function deleteUser(user: User) {
  users = users.filter((existingUser) => existingUser.id !== user.id);
}
export function updateUser(user: users, email: string, password: string) {
  user.email = email;
  user.password = password;
  return user;
}
