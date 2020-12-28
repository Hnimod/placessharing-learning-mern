const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': '.png',
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg',
};

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

const s3 = new aws.S3({});

const fileUpload = multer({
  limits: 500000,
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read-write',
    key(req, file, cb) {
      const extension = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + extension);
    },
  }),
  // storage: multer.diskStorage({
  //   destination: (req, file, callback) => {
  //     callback(null, 'uploads/images');
  //   },
  //   filename: (req, file, callback) => {
  //     const extension = MIME_TYPE_MAP[file.mimetype];
  //     callback(null, uuidv4() + extension);
  //   },
  // }),
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error('Invalid mime type');
    callback(error, isValid);
  },
});

module.exports = fileUpload;
