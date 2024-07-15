import { ITodo } from "./../interface/todo";
import { users } from "./users";
export type todos = {
  id: string;
  name: string;
  isDone: boolean;
};
export let todos: todos[] = [
  {
    id: "1",
    name: "todo1",
    isDone: false,
  },
  {
    id: "2",
    name: "todo2",
    isDone: false,
  },
];
export function getAllTodos(user: any) {
  const foundUser = users.find((u) => u.id === user.id);
  if (!foundUser) {
    return foundUser;
  }
  const userTodos = todos.filter((todo) => foundUser.todos.includes(todo.id));
  return userTodos;
}
export function createTodo(todo: ITodo, user: users) {
  const newTodo: todos = {
    id: String(todos.length + 1),
    ...todo,
  };
  todos.push(newTodo);
  user.todos.push(newTodo.id);
  return newTodo;
}
export function findTodoFromId(id: string) {
  return todos.find((todo) => todo.id === id);
}
export function findIfTodoBelongsToUser(foundUser: users, id: string) {
  const todoIndex = foundUser.todos.indexOf(id);
  return todoIndex;
}
