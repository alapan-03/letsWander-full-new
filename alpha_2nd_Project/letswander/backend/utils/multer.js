const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the destination folder exists and is accessible
    cb(null, path.join(__dirname, "./../utils"));
  },
  filename: function (req, file, cb) {
    // Use the original name or customize the filename if needed
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;
