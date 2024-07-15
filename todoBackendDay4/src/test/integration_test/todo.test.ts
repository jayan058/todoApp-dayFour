import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../../constants";
import todoRoute from "../../router/todos";
import * as userModels from "../../models/users";
import * as todosModels from "../../models/todos";
import expect from "expect";

const app = express();
app.use(express.json());
app.use("/todos", todoRoute);

let token: string;

describe("Todos Routes Integration Tests", () => {
  beforeEach(async () => {
    const password = await bcrypt.hash("password", BCRYPT_SALT_ROUNDS);
    const user = userModels.createUser(
      "testuser",
      password,
      "test@example.com"
    );
    userModels.users.push(user);

    token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, permission: ["user"] },
      "todoSecretKey",
      { expiresIn: "1h" }
    );

    todosModels.todos.push(
      { id: "1", name: "Task 1", isDone: false },
      { id: "2", name: "Task 2", isDone: true }
    );
    user.todos = ["1", "2"];
  });

  afterEach(() => {
    todosModels.todos.length = 0;
    userModels.users.length = 0;
  });

  it("should add a new todo", async () => {
    const newTodo = { name: "New Todo", isDone: false };
    const response = await request(app)
      .post("/todos/addTodos")
      .set("Authorization", `Bearer ${token}`)
      .send(newTodo)
      .expect(200);

    expect(response.body.name).toBe("New Todo");
    expect(response.body.isDone).toBe(false);
  });
  it("should get all todos", async () => {
    const response = await request(app)
      .get("/todos")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveLength(2);
  });
  it("should update a todo", async () => {
    const updatedTodo = { name: "Updated Task", isDone: true };
    const response = await request(app)
      .put("/todos/updateTodos/1")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedTodo)
      .expect(200);

    expect(response.body.name).toBe("Updated Task");
    expect(response.body.isDone).toBe(true);
  });

  it("should delete a todo", async () => {
    const response = await request(app)
      .delete("/todos/deleteTodos/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const deletedTodo = todosModels.todos.find((todo) => todo.id === "1");
    expect(deletedTodo).toBeUndefined();
  });
});
