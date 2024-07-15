import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import userRoute from "../../router/user";
import * as userModels from "../../models/users";
import { BCRYPT_SALT_ROUNDS } from "../../constants";
import bcrypt from "bcrypt";
import expect from "expect";
import { string } from "joi";
const app = express();
app.use(express.json());
app.use("/user", userRoute);

let token: string;

describe("User Routes Integration Tests", () => {
  beforeEach(async () => {
    const password = await bcrypt.hash("password", BCRYPT_SALT_ROUNDS);
    const user = userModels.createUser(
      "testuser",
      password,
      "test@example.com"
    );

    // Generate a token for the test user
    token = jwt.sign(
      {
        name: "new user",
        email: "newuser@example.com",
        password: "newpassword",
        permission: ["super admin"],
      },
      "todoSecretKey",
      { expiresIn: "1h" }
    );
  });

  afterEach(() => {
    const index = userModels.users.findIndex(
      (user) => user.email === "test@example.com"
    );
    if (index !== -1) {
      userModels.users.splice(index, 1);
    }
  });

  it("should create a new user", async () => {
    const response = await request(app)
      .post("/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: string,
        password: "newpassword",
        email: "newuser@example.com",
        name: "new user",
      })
      .expect(200);

    expect(response.body.name).toBe("new user");
    expect(response.body.email).toBe("newuser@example.com");
  });

  it("should get all users", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toStrictEqual(userModels.users);
  });

  it("should update a user", async () => {
    const user = userModels.findUserByEmail("jayan@jayan.com");

    const response = await request(app)
      .put(`/user/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "updateduser@example.com",
        password: "updatedpassword",
      })
      .expect(200);

    expect(response.body.email).toBe("updateduser@example.com");
  });

  it("should delete a user", async () => {
    const user = userModels.findUserByEmail("updateduser@example.com");
    await request(app)
      .delete(`/user/${user?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const deletedUser = userModels.findUserById(user?.id || "");
    expect(deletedUser).toBeUndefined();
  });
});
