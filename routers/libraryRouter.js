import { Router } from 'express';
import multer from 'multer';
import { storage } from '../utils/multerStorage.js';
import { displayAllFilesHandler, uploadFileHandler } from '../controllers/libraryController.js';

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
