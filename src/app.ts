import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import logger from "morgan";

import { connectDb } from "./config/db";
import { errorHandler, notFoundHandler } from "./middleware";
import { router } from "./routes";

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  legacyHeaders: false,
});

// Middlewares
app.use(express.json());
app.use(logger("dev"));
app.use(cors());
app.use(limiter);

connectDb();

// Routes
app.use("/v1", router);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
