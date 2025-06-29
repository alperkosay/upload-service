import path from "path";
import sharp from "sharp";
import { allowedExtensions } from "../consts/file.consts";
import fs from "fs/promises";
import { FileUploadOptions } from "../types/file.type";
import logger from "../utils/logger";

//#region Get File
const getFile = async (
  fileName: string
): Promise<Buffer<ArrayBufferLike> | null> => {
  try {
    const file = await fs.readFile(
      `${process.cwd()}/public/uploads/${fileName}`,
      {}
    );

    return file;
  } catch (error) {
    logger.error("Error reading file:", error);
    return null;
  }
};
//#endregion

//#region Create File
type CreateFileResponse = {
  fullPath: string;
  fileName?: string;
  fileSize: number;
  fileWidth?: number;
  fileHeight?: number;
};

const createFile = async (
  file: Express.Multer.File,
  options: FileUploadOptions = {}
): Promise<CreateFileResponse | null> => {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const fileName =
    options.customFileName ??
    path.basename(file.originalname, path.extname(file.originalname));

  const filePath = `${options.uploadPath ?? ""}/` + fileName;
  const fullPath = path.join(uploadDir, filePath);
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("Unsupported file type");
  }

  try {
    // Resim dosyalarını özel olarak formatlayarak işlemek için
    if (file.mimetype.includes("image")) {
      const format = options.fileFormat ?? "webp"; // Default to webp format
      const sharpFile = await sharp(file.buffer)
        .toFormat(format, {
          quality: Number(options.imageQuality ?? "100") ?? 100,
        }) // Default to webp format
        .toFile(`${fullPath}.${format}`);

      return {
        fullPath: `/uploads${filePath}.${format}`,
        fileHeight: sharpFile.height,
        fileWidth: sharpFile.width,
        fileName,
        fileSize: sharpFile.size,
      };
    }

    // Resim olmayan dosyaları direkt kaydetmek için
    await fs.writeFile(fullPath + fileExtension, file.buffer);
    return {
      fullPath: "/uploads" + `${filePath + fileExtension}`,
      fileName,
      fileSize: file.size,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

//#endregion

export default {
  getFile,
  createFile,
};
