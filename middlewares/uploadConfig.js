const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.SCALEWAY_REGION,
  endpoint: process.env.SCALEWAY_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
    secretAccessKey: process.env.SCALEWAY_SECRET_KEY
  }
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.SCALEWAY_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => { cb(null, { fieldName: file.fieldname }); },
    key: (req, file, cb) => {
      const folder = process.env.SCALEWAY_FOLDER || 'grp_default';
      const filename = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
      cb(null, `${folder}/${filename}`);
    }
  }),
  limits: { fileSize: 300 * 1024 * 1024 } 
});

module.exports = upload;