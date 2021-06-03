const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = new aws.S3({
  accessKeyId: 'AKIAU2BTZSVQ6SMW6IOW',
  secretAccessKey: '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'
});

const uploadsMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'oasis.swim',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
}).single('image');

module.exports = uploadsMiddleware;
