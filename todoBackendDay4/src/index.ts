import express from "express";
import cors from "cors";
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
import handleNotFoundRoutes from "./middleware/routeNotFound";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {
  REQUEST_RATE_LIMIT_WINDOW_MS,
  MAXIMUM_REQUESTS_PER_WINDOW,
} from "./constants";
const app = express();
const cookieParser = require("cookie-parser");
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
const limiter = rateLimit({
  windowMs: REQUEST_RATE_LIMIT_WINDOW_MS,
  max: MAXIMUM_REQUESTS_PER_WINDOW,
});
app.use(limiter);
app.use(router);
app.use(handleNotFoundRoutes);
app.use(errorHandler);
app.listen(config.port, () => {
  console.log(`Listening on port ${config.port} `);
});
