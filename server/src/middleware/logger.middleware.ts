import pinoHttp from "pino-http";
import { logger } from "../utils/logger";
import { randomUUID } from "crypto";

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    return req.headers["x-request-id"]?.toString() || randomUUID();
  },
  autoLogging: true,
  customLogLevel: function (req, res, err) {
    const status = res.statusCode ?? 500; // fallback
    if (err || status >= 500) return "error";
    if (status === 304) return "debug";
    if (status >= 400) return "warn";
    return "info";
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode ?? 0, // pastikan tidak undefined
      };
    },
  },
});
