import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

export const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const folderName = req.folderName; // set by resolveFolderName middleware
    const uploadBase = 'uploads';
    const uploadPath = folderName ? path.join(uploadBase, folderName) : uploadBase;

    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },

  filename: async (req, file, cb) => {
    const folderName = req.folderName;
    const uploadBase = 'uploads';
    const uploadPath = folderName ? path.join(uploadBase, folderName) : uploadBase;

    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);

    let finalName = originalName;
    let counter = 1;

    // Use try-catch to avoid crashing on error
    try {
      while (true) {
        const filePath = path.join(uploadPath, finalName);
        try {
          await fs.access(filePath); // If this doesn't throw, file exists
          finalName = `${base}(${counter})${ext}`;
          counter++;
        } catch {
          break; // File doesn't exist, we're good
        }
      }

      cb(null, finalName);
    } catch (err) {
      cb(err);
    }
  }
});
