import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
  destination: 'uploads/', 
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});