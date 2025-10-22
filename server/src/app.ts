import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import session from "express-session";
import hpp from "hpp";
import compression from "compression";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware";
import { httpLogger } from "./middleware/logger.middleware";

import productsRouter from "./routes/products.route";

dotenv.config();

const app = express();

// http headers
app.use(helmet());
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

// cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// compress responses
app.use(compression());

// parse body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(httpLogger);

// morgan for access logs
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// rate limiter (basic)
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  max: Number(process.env.RATE_LIMIT_MAX ?? 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

app.use(limiter);

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "9f3e7a8d6b5a2c4c1e90b8fbdca9e3178cbd49e0e0f4a16c3f39a6dd49fe1a2d",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60, // 1 hour
      sameSite: "strict",
    },
  })
);

// routes
app.use("/api/v1/products", productsRouter);

// error handler
app.use(errorHandler);

export default app;
