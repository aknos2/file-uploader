import prisma from "../lib/prisma.js";
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '../utils/supaBaseClient.js';

export async function createFolder(name, userId) {
  const folder = await prisma.folder.create({
    data: { name, userId },
  });

  const folderPath = path.join('uploads', name);

  try {
    await fs.mkdir(folderPath, { recursive: true });
  } catch (err) {
    console.error('Failed to create physical folder:', err);
  }

  return folder;
}

export async function uploadFile(name, size, type, userId, folderId = null) {
  const result = await prisma.data.create({
    data: {name, size, type, userId, folderId}
  });
  
  return result;
}

export async function deleteFile(id) {
  const file = await prisma.data.findUnique({ where: { id } });
  if (!file) throw new Error('File not found');

  await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .remove([file.path]); // use saved path

  return await prisma.data.delete({ where: { id } });
}


export async function deleteFolder(id) {
  const folder = await prisma.folder.findUnique({
    where: { id },
    include: { data: true }
  });

  if (!folder) throw new Error('Folder not found');

  // 1. Delete files from Supabase Storage
  const filePaths = folder.data.map(file => file.path).filter(Boolean);

  if (filePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .remove(filePaths);

    if (storageError) console.warn('Failed to delete files from Supabase:', storageError);
  }

  // 2. Delete metadata from DB
  await prisma.data.deleteMany({
    where: { folderId: id }
  });

  // 3. (optional) delete folder on disk if you're using local folders
  const folderPath = path.join('uploads', folder.name);
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
  } catch (err) {
    console.warn(`Could not delete folder from disk: ${folderPath}`, err);
  }

  // 4. Delete folder metadata
  return await prisma.folder.delete({
    where: { id },
  });
}


export async function displayFiles(userId) {
  const files = await prisma.data.findMany({
    where: { folderId: null, userId },
    include: { folder: true }
  });
  
  return files;
}

export async function foldersWithFiles(userId) {
  return await prisma.folder.findMany({
   where: { userId },
   include: { data: true },
  }); 
}

export async function viewFolder(folderId, userId) {
  const result = await prisma.folder.findUnique({
    where: { id: folderId, userId },
    include: { data: true },
  });
  
  return result;
}

export async function editFileName(fileId, name, userId) {
  return await prisma.data.update({
    where: { id: fileId, userId },
    data: { name },
  });
}
export async function editFolderName(folderId, name, userId) {
  return await prisma.folder.update({
    where: { id: folderId, userId },
    data: { name },
  });
}
export async function findFile (fileId, userId) {
  return await prisma.data.findFirst({
    where: { id: fileId, userId },
  });
}
export async function findFolder (folderId, userId) {
  return await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });
}
export async function uniqueFolder(name, userId, folderId) {
  return await prisma.folder.findFirst({
    where: {name: name.trim(), userId},
    id: {not: folderId}
  })
}