import winston from "winston";
import dailyRotateFile from "winston-daily-rotate-file";
import env from "./env";

const { timestamp, json, prettyPrint, colorize, label, combine, printf } =
  winston.format;

const loggerConfig: winston.LoggerOptions = {
  defaultMeta: {
    api: "NODE SERVER",
  },
  level: "verbose",
  transports: [
    new dailyRotateFile({
      datePattern: "DD.MM.YYYY",
      filename: "app-%DATE%.log",
      dirname: "./logs",
    }),
  ],
  format: combine(
    label({ label: `APP ${env.APP_VERSION}` }),
    timestamp(),
    prettyPrint(),
    colorize(),
    json({ space: 0 })
  ),
};

export default loggerConfig;
