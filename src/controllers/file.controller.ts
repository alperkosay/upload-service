import { Request, Response } from "express";
import fs from "fs/promises";

/**
 * @summary Retrieves a file by its ID.
 */
const getFileController = async (req: Request, res: Response) => {
  // Logic to retrieve a file

  const file = await fs.readFile(
    `${process.cwd()}/public/uploads/${req.params.id}`
  );

  if (!file) {
    res.status(404).json({ message: "File not found" });
  }
  res.status(200).send(file);
};

/**
 * @summary Retrieves all files.
 */
const getAllFilesController = async (req: Request, res: Response) => {
  // Logic to retrieve all files
  try {
    const files = await fs.readdir(`${process.cwd()}/public/uploads/`, {
      withFileTypes: true,
    });

    const extendedFiles = files.map((file) => ({
      isFolder: file.isDirectory(),
      name: file.name,
      filePath: `/api/file/${file}`,
    }));

    res.status(200).json(extendedFiles);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve files" });
  }
};

const createFileController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      throw (new Error("No file uploaded").name = "FileUploadError");
    }

    const filePath = process.cwd() + "/" + req.file.destination;
    await fs.rename(
      filePath + req.file.filename,
      filePath + req.file.originalname
    );

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
      files: req.files,
    });
  } catch (err) {
    const error = err as Error;
    if (error.name === "FileUploadError") {
      res.status(400).json({ message: "No file uploaded" });
    } else {
      res.status(500).json({ message: "File upload failed" });
    }
  }
};

export default {
  getFileController,
  getAllFilesController,
  createFileController,
};
