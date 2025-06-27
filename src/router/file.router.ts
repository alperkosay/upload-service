import fileController from "../controllers/file.controller";
import multerMiddleware from "../middleware/multer.middleware";

import { Router } from "express";

const router = Router();

router.get("/file", fileController.getAllFilesController);

router.get("/file/:id", fileController.getFileController);

router.post(
  "/file",
  multerMiddleware.upload.single("file"),
  fileController.createFileController
);

export default router;
