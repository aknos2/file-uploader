import asyncHandler from 'express-async-handler';
import path from 'path';
import prisma from '../lib/prisma.js'; // Add this missing import
import { createFolder, deleteFile, deleteFolder, displayFiles, foldersWithFiles, uploadFile, viewFolder } from '../services/libraryServices.js';
import { formatFileData, formatFolderData } from '../utils/formatFileData.js';

export const uploadFileHandler = asyncHandler(async(req, res) => {
  console.log('📥 req.body.folderId:', req.body.folderId);
  if (!req.file) {
   return res.status(400).render('library', {
    errors: [{msg: 'No file uploaded'}]
   })
  }

  const name = req.file.filename; // ✅ this is the final name (with (2), etc.)
  const size = req.file.size;
  const userId = req.user.id;
  const folderId = req.body.folderId || null;
  const ext = path.extname(name).slice(1);
  const type = ext || "file";
  
  try {
    await uploadFile(name, size, type, userId, folderId);
    res.redirect('/library');
  } catch(err) {
    console.error('Upload failed', err);
    throw err;
  }
});

export const displayAllFilesHandler = asyncHandler(async(req, res) => {
  const allFiles = formatFileData(await displayFiles());
  const allFolders = formatFolderData(await foldersWithFiles());
  res.render('library', { allFolders, allFiles });
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

export const deleteFolderHandler = asyncHandler(async(req, res, next) => {
  try {
    const folderId = req.params.id;
    await deleteFolder(folderId);
    res.redirect('/library');
  } catch(err) {
    next(err)
  }
});

export const createFolderHandler = asyncHandler(async(req, res) => {
  const name = req.body.folderName || `New folder`;
  const userId = req.user.id;
  try {
    await createFolder(name, userId);
    res.redirect('/library');
  } catch(err) {
    console.error('Create folder failed', err);
    throw err;
  }
});

export async function resolveFolderName(req, res, next) {
  const folderId = req?.body?.folderId || req?.query?.folderId;

  if (!folderId) return next();

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(400).send('Folder not found');
    }

    req.folderName = folder.name;
    next();
  } catch (err) {
    next(err);
  }
}

export const viewFolderHandler = asyncHandler(async(req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await viewFolder(folderId);
    
    if (!folder) {
      return res.status(400).send('Folder not found');
    }
    const folderFiles = formatFileData(folder.data);

    res.render('folder', { folder, folderFiles});
  } catch(err) {
    console.error('Error displaying folder', err);
    throw err;
  }
});