import app from "./app";
import dotenv from "dotenv";
import { logger } from "./utils/logger";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const server = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  logger.error({ err }, "Unhandled Rejection, shutting down");
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught Exception, shutting down");
  process.exit(1);
});
