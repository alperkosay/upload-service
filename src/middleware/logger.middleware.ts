import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info({
    ip: req.ip,
    method: req.method,
    path: req.path,
    body: JSON.stringify(req.body),
    params: JSON.stringify(req.params),
    query: JSON.stringify(req.query),
    accessTime: Date.now(),
    url: req.url,
  });

  next();
};

export default loggerMiddleware;
