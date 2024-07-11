import express from "express";
import * as userController from "../controller/user";
import * as userMiddleware from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validation";
import * as userSchema from "../schema/user";
const userRoute = express();

userRoute.post(
  "/",
  userMiddleware.authenticate,
  userMiddleware.authorize(),
  validateBody(userSchema.createUserSchema),
  userController.createUser
);

userRoute.get(
  "/",
  userMiddleware.authenticate,
  userMiddleware.authorize(),
  userController.getUsers
);

userRoute.delete(
  "/:id",
  userMiddleware.authenticate,
  userMiddleware.authorize(),
  validateParams(userSchema.userIdSchema),
  userController.deleteUser
);

userRoute.put(
  "/:id",
  userMiddleware.authenticate,
  userMiddleware.authorize(),
  validateBody(userSchema.updateUserSchema),
  validateParams(userSchema.userIdSchema),
  userController.updateUser
);

export default userRoute;
