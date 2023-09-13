const multer = require('multer')
const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
    keyFilename: path.join(__dirname, "../config/eastern-bedrock-396813-c57f6c410ede.json"),
    projectId: "eastern-bedrock-396813",
});
  
const bucket = storage.bucket('collab_bucket_storage');

const upload = multer({
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB file size limit
    },
    fileFilter: (req, file, cb) => {
      // Perform file type validation
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type.'));
      }
    },
    storage: multer.memoryStorage()
});

exports.bucket = bucket;
exports.upload = upload;