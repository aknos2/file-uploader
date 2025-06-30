import { Router } from 'express';
import multer from 'multer';
import { storage } from '../utils/multerStorage.js';
import { deleteFileHandler, displayAllFilesHandler, uploadFileHandler } from '../controllers/libraryController.js';
import path from 'path';
import { __dirname } from '../app.js';

const upload = multer({ storage })
export const libraryRouter = Router();

libraryRouter.get('/library', displayAllFilesHandler);
libraryRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});
libraryRouter.post('/upload', upload.single('file'), uploadFileHandler);
libraryRouter.post('/:id/delete', deleteFileHandler);
libraryRouter.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath, err => {
    if (err) {
      console.error('File download error:', err);
      return res.status(404).send('File not found');
    }
  });
});
