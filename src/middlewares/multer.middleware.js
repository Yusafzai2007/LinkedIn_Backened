import multer from "multer";

function random() {
  return (1000 + Math.random() * 9000).toString();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/image");
  },

  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const generate = random();
    cb(null, generate + "." + ext);
  },
});

export const upload = multer({
  storage,
});