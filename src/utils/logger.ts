import winston from "winston";
import loggerConfig from "../configs/logger.config";

const logger = winston.createLogger(loggerConfig);

export default logger;
