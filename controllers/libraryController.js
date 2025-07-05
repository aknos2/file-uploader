import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';
import { v4 as uuid } from 'uuid';
import { supabase } from '../utils/supaBaseClient.js';
import { createFolder, deleteFile, deleteFolder, displayFiles, editFileName, editFolderName, findFile, findFolder, foldersWithFiles, uniqueFolder, viewFolder } from '../services/libraryServices.js';
import { formatFileData, formatFolderData } from '../utils/formatFileData.js';
import { fixDoubleUTF8Encoding } from '../utils/fixDoubleUTF8Encoding.js';
import dotenv from 'dotenv';
dotenv.config();

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

export const uploadFileHandler = asyncHandler(async (req, res) => {
  const { from, folderId } = req.body;
  const userId = req.user.id;
  const file = req.file;
  
  // Fix the double UTF-8 encoding issue
  let originalName = file.originalname;
  
  // Check if the filename looks like it has double UTF-8 encoding
  if (/[À-ÿ]/.test(originalName)) {
    originalName = fixDoubleUTF8Encoding(originalName);
  }
  
  // Normalize to NFC (safe for most UTF-8 environments)
  originalName = originalName.normalize('NFC');

  // Create a safe filename by removing or replacing problematic characters
  const safeFileName = originalName
    .replace(/[^\w\-_.()[\]{}]/g, '_') // Replace non-ASCII and special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single underscore
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores

  // Ensure we have a valid filename
  const finalFileName = safeFileName || 'unnamed_file';
  
  // Get file extension
  const fileExtension = originalName.split('.').pop() || '';
  const baseFileName = finalFileName.replace(/\.[^/.]+$/, ''); // Remove extension if present
  
  // Create safe file path with UUID prefix
  const filePath = `${uuid()}-${baseFileName}${fileExtension ? '.' + fileExtension : ''}`;

  // 1. Upload file
  const { error: uploadError } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // 2. Generate signed URL (after upload)
  const { data: signedData, error: signedError } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .createSignedUrl(filePath, 60); // 60 seconds

  if (signedError) throw signedError;

  // 3. Save to database (use the corrected original name)
  await prisma.data.create({
    data: {
      name: originalName, // Now properly decoded Japanese characters
      path: filePath,    // Use safe path for storage
      size: file.size,
      type: file.mimetype,
      url: signedData.signedUrl,
      folderId: folderId || null,
      userId,
    }
  });

  res.redirect(from === 'folder' && folderId ? `/folder/${folderId}` : '/library');
});

export const displayAllFilesHandler = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const allFiles = await displayFiles(userId);
  const allFolders = await foldersWithFiles(userId);

  const formattedFiles = await Promise.all(
    formatFileData(allFiles).map(async (file) => {
      const { data: signedData, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .createSignedUrl(file.path, 60); // expires in 60 seconds

      return {
        ...file,
        url: signedData?.signedUrl || null 
      };
    })
  );

  const formattedFolders = formatFolderData(allFolders);

  res.render('library', {
    allFiles: formattedFiles,
    allFolders: formattedFolders
  });
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
  const baseName = req.body.folderName || `New folder`;
  const userId = req.user.id;

  let folderName = baseName;
  let counter = 1;
  
  // Keep trying until we find a unique name
  while (true) {
    try {
      await createFolder(folderName, userId);
      break;
    } catch (error) {
      // If it's a unique constraint error, try with a different name
      if (error.code === 'P2002') {
        counter++;
        folderName = `${baseName} (${counter})`;
      } else {
        // If it's a different error, re-throw it
        throw error;
      }
    }
  }
  
  res.redirect('/library');
});

export const viewFolderHandler = asyncHandler(async (req, res) => {
  const folderId = req.params.id;
  const userId = req.user.id;

  const folder = await viewFolder(folderId, userId);
  if (!folder) {
    return res.status(400).send('Folder not found');
  }

  const folderFiles = await Promise.all(
    formatFileData(folder.data).map(async (file) => {
      const { data: signedData, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .createSignedUrl(file.path, 60);

      return {
        ...file,
        url: signedData?.signedUrl || null
      };
    })
  );

  res.render('folder', { folder, folderFiles });
});

export const editFileNameHandler = asyncHandler(async(req, res) => {
  const fileId = req.params.id;
  const fileName = req.body.name;
  const userId = req.user.id;

  if (!fileId) return res.status(400).json({ error: 'File ID is required'});

  const file = await findFile(fileId, userId);
  if (!file) return res.status(400).json({ error: 'File not found '});

  const updatedFile = await editFileName(fileId, fileName.trim(), userId)
  
  res.json({ success: true, file: updatedFile });
});

export const editFolderNameHandler = asyncHandler(async(req, res) => {
  const folderId = req.params.id;
  const folderName = req.body.name;
  const userId = req.user.id;

  if (!folder) return res.status(400).json({ error: 'File ID is required'});

  const folder = await findFolder(folderId, userId);
  if (!file) return res.status(400).json({ error: 'Folder not found '});

  const existingFolder = uniqueFolder(folderName, userId, folderId);
  if (existingFolder) return res.status(400).json({ error: 'Folder name already exists' });

  const updatedFolder = await editFolderName(fileId, fileName.trim(), userId)
  
  res.json({ success: true, folder: updatedFolder });
});