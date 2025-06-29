import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileService } from "../services";
import { fileDto } from "../dto/file.dto";
import { FileUploadOptions } from "../types/file.type";

/**
 * @summary Retrieves a file by its ID.
 */
const getFileController = async (req: Request, res: Response) => {
  // Logic to retrieve a file
  const file = await fileService.getFile(req.params.id);

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

/**
 *
 * @summary Creating single or multiple files
 */
const createFileController = async (req: Request, res: Response) => {
  try {
    // Dosya var mı yok mu kontrol et
    if (!req.file) {
      const err = new Error("No file uploaded");
      err.name = "FileUploadError";
      throw err;
    }

    const {
      fileFormat,
      customFileName,
      uploadPath,
      imageQuality,
    }: FileUploadOptions = req.query;

    console.log("Creating:", req.file);

    const createdFile = await fileService.createFile(req.file, {
      fileFormat,
      uploadPath,
      customFileName,
      imageQuality,
    });

    res.status(200).json({
      ...fileDto,
      status: true,
      message: "File uploaded successfully",
      file: createdFile,
    });
  } catch (err) {
    const error = err as Error;
    console.log(error);

    if (error.name === "FileUploadError") {
      res.status(400).json({ ...fileDto, message: "No file uploaded" });
    }

    res.status(500).json({ ...fileDto, message: "File upload failed" });
  }
};

export default {
  getFileController,
  getAllFilesController,
  createFileController,
};
