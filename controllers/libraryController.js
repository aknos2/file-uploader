import asyncHandler from 'express-async-handler';
import path from 'path';
import { deleteFile, displayFiles, uploadFile } from '../services/libraryServices.js';
import { formatFileData } from '../utils/formatFileData.js';

export const uploadFileHandler = asyncHandler(async(req, res) => {
  if (!req.file) {
   return res.status(400).render('library', {
    errors: [{msg: 'No file uploaded'}]
   })
  }

  const name = req.file.filename; // ✅ this is the final name (with (2), etc.)
  const size = req.file.size;
  const userId = req.user.id;
  const ext = path.extname(name).slice(1);
  const type = ext || "file";
  try {
    await uploadFile(name, size, type, userId);
    res.redirect('/library');
  } catch(err) {
    console.log('Upload failed', err);
    throw err;
  }
});

export const displayAllFilesHandler = asyncHandler(async(req, res) => {
  const allFiles = formatFileData(await displayFiles());

  res.render('library', { allFiles })
});

export const deleteFileHandler = asyncHandler(async(req, res, next) => {
  try {
    const fileId = req.params.id;
    await deleteFile(fileId);
    res.redirect('/library');
  } catch(err) {
    next(err)
  }
});