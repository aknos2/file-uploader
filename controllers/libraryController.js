import asyncHandler from 'express-async-handler';
import { displayFiles, uploadFile } from '../services/libraryServices.js';
import { formatMessageDates } from '../utils/dateFormat.js';

export const uploadFileHandler = asyncHandler(async(req, res) => {
  if (!req.file) {
   return res.status(400).render('library', {
    errors: [{msg: 'No file uploaded'}]
   })
  }

   const { originalname, size } = req.file;
  try {
    await uploadFile(originalname, size, req.user.id);
    res.redirect('/library');
  } catch(err) {
    console.log('Upload failed', err);
    throw err;
  }
});

export const displayAllFilesHandler = asyncHandler(async(req, res) => {
  const allFiles = formatMessageDates(await displayFiles());

  res.render('library', { allFiles })
});
