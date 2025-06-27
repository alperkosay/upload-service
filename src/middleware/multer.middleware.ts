import multer from "multer";

const upload = multer({
  dest: "public/uploads/",
  preservePath: true,
});

export default { upload };
