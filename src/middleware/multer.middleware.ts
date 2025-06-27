import multer from "multer";

const upload = multer({
  dest: "public/uploads/",
  preservePath: true,
  storage: multer.memoryStorage(),
});

export default { upload };
