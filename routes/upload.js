var express = require('express');
var router = express.Router();

// Require your controller if you have one
// For simplicity, define handler here
router.post('/', upload.single('image'), function(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // req.body contains other fields
  res.json({
    message: 'Upload successful',
    file: req.file,
    fields: req.body
  });
});

module.exports = router;