const multer = require('multer');

// Configure multer with memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  }
});

module.exports = upload;
