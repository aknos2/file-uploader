import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uploadDir = 'uploads/';
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);

    let finalName = originalName;
    let counter = 1;

    // Check if file exists and increment name if needed
    while (fs.existsSync(path.join(uploadDir, finalName))) {
      finalName = `${base}(${counter})${ext}`;
      counter++;
    }

    cb(null, finalName);
  }
});
