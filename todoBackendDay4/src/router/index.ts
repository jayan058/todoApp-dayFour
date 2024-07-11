import express from "express";

import todoRoute from "./todos";
import userRoute from "./user";
import authRoute from "./auth";

const router = express();

router.use("/todos", todoRoute);

router.use("/user", userRoute);

router.use("/login", authRoute);

export default router;
