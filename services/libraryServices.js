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
  const result = await prisma.data.create({
    data: {name, size, type, userId, folderId}
  });
  
  return result;
}

export async function deleteFile(id) {
  const file = await prisma.data.findUnique({
    where: { id },
    include: { folder: true }
  });

  if (!file) {
    throw new Error('File not found');
  }

  let filePath;
  if (file.folder) {
    filePath = path.join('uploads', file.folder.name, file.name);
  } else {
    filePath = path.join('uploads', file.name);
  }

  await fs.unlink(filePath).catch((err) => {
    console.warn(`Could not delete file from disk: ${filePath}`, err);
  });

  return await prisma.data.delete({
    where: { id },
  });
}

export async function deleteFolder(id) {
  const folder = await prisma.folder.findUnique({
    where: { id },
    include: { data: true }
  });

  if (!folder) {
    throw new Error('Folder not found');
  }

  await prisma.data.deleteMany({
    where: { folderId: id }
  });

  const folderPath = path.join('uploads', folder.name); 
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
  } catch (err) {
    console.warn(`Could not delete folder from disk: ${folderPath}`, err);
  }

  return await prisma.folder.delete({
    where: { id },
  });
}

export async function displayFiles() {
  const files = await prisma.data.findMany({
    where: { folderId: null },
    include: { folder: true }
  });
  
  return files;
}

export async function foldersWithFiles() {
  return await prisma.folder.findMany({
   include: { data: true },
  }); 
}

export async function viewFolder(folderId) {
  const result = await prisma.folder.findUnique({
    where: { id: folderId },
    include: { data: true },
  });
  
  return result;
}