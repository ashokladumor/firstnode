

exports.uploadImage = (req, res) => {
  // Multer puts uploaded file info in req.file
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  // Other form fields are available on req.body
  const { title, description } = req.body;

  // For demonstration, just send them back:
  res.json({
    message: 'Upload successful',
    file: req.file,
    fields: { title, description }
  });
};