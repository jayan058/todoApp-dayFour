import express from "express";
import * as authController from "../controller/auth";

const authRoute = express();

authRoute.post("/", authController.login);

authRoute.post("/token", authController.handleTokenRefresh);

export default authRoute;
