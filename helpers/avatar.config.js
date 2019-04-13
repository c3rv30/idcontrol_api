const path = require('path');
const multer = require('multer');
const fs = require('fs');

function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimeType);

  if (mimeType && extname) {
    cb(null, true);
  } else {
    cb('Error: Images only!!');
  }
}
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${file.filename}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

module.exports = {
  avatarUpload: async () => {
    try {
      console.log('OK');
      return upload;
    } catch (error) {
      console.log('ÑIOOOO');
      return error;
    }
  },
};

/*
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${file.filename}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimeType);

  if (mimeType && extname) {
    cb(null, true);
  } else {
    cb('Error: Images only!!');
  }
}
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');


module.exports = [
  upload,
];

 uploadImage(req, res, err) => {
  if (err) {
    err.message = 'The file is so heavy for my service';
    return res.send(err);
  }
  console.log();
  return true;
};
*/
