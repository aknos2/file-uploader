import { Router } from 'express';
import multer from 'multer';
import { deleteFileHandler, 
         displayAllFilesHandler, 
         uploadFileHandler, 
         createFolderHandler, 
         resolveFolderName, 
         viewFolderHandler, 
         deleteFolderHandler, 
         editFolderNameHandler, 
         editFileNameHandler 
        } from '../controllers/libraryController.js';
import { __dirname } from '../app.js';

const upload = multer({ storage: multer.memoryStorage() }); // 🧠 File stays in memory
export const libraryRouter = Router();

libraryRouter.get('/library', displayAllFilesHandler);
libraryRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});
libraryRouter.get('/folder/:id', viewFolderHandler);
libraryRouter.post('/upload', upload.single('file'), resolveFolderName, uploadFileHandler);
libraryRouter.post('/create-folder', createFolderHandler);
libraryRouter.post('/:id/delete', deleteFileHandler);
libraryRouter.post('/folder/:id/delete', deleteFolderHandler);
libraryRouter.post('/:id/edit', editFileNameHandler);
libraryRouter.post('/folder/:id/edit', editFolderNameHandler)