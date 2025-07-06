import { Router } from 'express';
import multer from 'multer';
import { storage } from '../utils/multerStorage.js';
import path from 'path';
import { __dirname } from '../app.js';
import { deleteFileHandler } from '../controllers/libraryController.js';

const upload = multer({ storage })
export const folderRouter = Router();

folderRouter.get('/folder/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath, err => {
    if (err) {
      console.error('File download error:', err);
      return res.status(404).send('File not found');
    }
  });
});
folderRouter.post('/folder/:id/delete', deleteFileHandler);