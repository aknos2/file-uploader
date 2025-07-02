import asyncHandler from 'express-async-handler';
import path from 'path';
import prisma from '../lib/prisma.js';
import { createFolder, deleteFile, deleteFolder, displayFiles, foldersWithFiles, uploadFile, viewFolder } from '../services/libraryServices.js';
import { formatFileData, formatFolderData } from '../utils/formatFileData.js';

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

export const uploadFileHandler = asyncHandler(async(req, res) => {
  if (!req.file) {
   return res.status(400).render('library', {
    errors: [{msg: 'No file uploaded'}]
   })
  }

  const name = req.file.filename;
  const size = req.file.size;
  const userId = req.user.id;
  const { from } = req.body;
  
  let folderId = req.body.folderId;
  
  if (folderId === '' || folderId === 'undefined' || !folderId) {
    folderId = null;
  }
  
  const ext = path.extname(name).slice(1);
  const type = ext || "file";
  
  try {
    await uploadFile(name, size, type, userId, folderId);

    if (from === 'folder' && folderId) {
      return res.redirect(`/folder/${folderId}`);
    }

    res.redirect('/library');
  } catch(err) {
    console.error('Upload failed', err);
    throw err;
  }
});

export const displayAllFilesHandler = asyncHandler(async(req, res) => {
  const allFiles = await displayFiles();
  const allFolders = await foldersWithFiles();
  
  const formattedFiles = formatFileData(allFiles);
  const formattedFolders = formatFolderData(allFolders);
  
  res.render('library', { allFolders: formattedFolders, allFiles: formattedFiles });
});

export const deleteFileHandler = asyncHandler(async(req, res, next) => {
  try {
    const fileId = req.params.id;
    const { from, folderId } = req.body;
    await deleteFile(fileId);

    if (from === 'folder' && folderId) {
      return res.redirect(`/folder/${folderId}`);
    }

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

export const viewFolderHandler = asyncHandler(async(req, res) => {
  try {
    const folderId = req.params.id;
    
    const folder = await viewFolder(folderId);
    
    if (!folder) {
      return res.status(400).send('Folder not found');
    }
    
    const folderFiles = formatFileData(folder.data);

    res.render('folder', { folder, folderFiles });
  } catch(err) {
    console.error('Error displaying folder', err);
    throw err;
  }
});