import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { routes } from "./router";
import env from "./configs/env";
import swaggerUi from "swagger-ui-express";
import multer from "multer";
const swaggerSpec = require("../swagger.config.json");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//#region Routes

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const timeInMs = diff[0] * 1000 + diff[1] / 1e6;
    console.log(`${req.method} ${req.originalUrl} - ${timeInMs.toFixed(2)} ms`);
  });
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(env.APP_PREFIX, routes.file);

//#endregion

export default app;
