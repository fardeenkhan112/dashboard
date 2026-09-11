import multer from 'multer';

// Store uploaded image temporarily in memory.
// Cloudinary will receive the file directly from memory.
const storage = multer.memoryStorage();

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed!'
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});