import prisma from "../lib/prisma.js";
import fs from 'fs/promises';
import path from 'path';

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

export async function findFolderByName(name) {
  return await prisma.folder.findUnique({
    where: { name },
  });
}

export async function uploadFile(name, size, type, userId, folderId = null) {
  return await prisma.data.create({
    data: {name, size, type, userId, folderId}
  });
}

export async function deleteFile(id) {
  const file = await prisma.data.findUnique({
    where: { id },
    include: { folder: true }
  });

  if (!file) {
    throw new Error('File not found');
  }

  // Construct the correct file path
  let filePath;
  if (file.folder) {
    // File is in a folder
    filePath = path.join('uploads', file.folder.name, file.name);
  } else {
    // File is in root uploads directory
    filePath = path.join('uploads', file.name);
  }

  // Delete from disk
  await fs.unlink(filePath).catch((err) => {
    console.warn(`Could not delete file from disk: ${filePath}`, err);
  });

  // Delete from DB
  return await prisma.data.delete({
    where: { id },
  });
}

export async function deleteFolder(id) {
  const folder = await prisma.folder.findUnique({
    where: { id },
    include: { data: true } // Include files to delete them first
  });

  if (!folder) {
    throw new Error('Folder not found');
  }

  // Delete all files in the folder from the database first
  await prisma.data.deleteMany({
    where: { folderId: id }
  });

  const folderPath = path.join('uploads', folder.name); 
  try {
    // Delete the physical folder and all its contents
    await fs.rm(folderPath, { recursive: true, force: true });
  } catch (err) {
    console.warn(`Could not delete folder from disk: ${folderPath}`, err);
  }

  // Delete the folder from database
  return await prisma.folder.delete({
    where: { id },
  });
}

export async function displayFiles() {
  // Only return files that are NOT in folders (root level files only)
  return await prisma.data.findMany({
    where: { folderId: null }, // This is the key fix!
    include: { folder: true }
  });
}

export async function foldersWithFiles() {
  return await prisma.folder.findMany({
   include: { data: true },
  }); 
}

export async function viewFolder(folderId) {
  return await prisma.folder.findUnique({
    where: { id: folderId },
    include: { data: true },
  });
}