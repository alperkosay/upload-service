import { FormatEnum } from "sharp";

export type FileUploadOptions = {
  fileFormat?: keyof FormatEnum;
  customFileName?: string;
  uploadPath?: string;
  imageQuality?: string;
};
