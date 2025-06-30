import prisma from "../lib/prisma.js";
import fs from 'fs/promises';
import path from 'path';

export async function createFolder(name, createdAt, uploadedAt) {
  return await prisma.folder.create({
    data: {name, createdAt, uploadedAt}
  })
}

export async function findFolderByName(name) {
  return await prisma.folder.findUnique({
    where: { name },
  });
}

export async function uploadFile(name, size, type, userId) {
  return await prisma.data.create({
    data: {name, size, type, userId}
  });
}


export async function deleteFile(id) {
  const file = await prisma.data.findUnique({
    where: { id },
  });

  if (!file) {
    throw new Error('File not found');
  }

  // 2. Delete from disk
  const filePath = path.join('uploads', file.name);
  await fs.unlink(filePath).catch((err) => {
    // Optionally: log and continue even if file missing
    console.warn(`Could not delete file from disk: ${filePath}`, err);
  });

  // 3. Delete from DB
  return await prisma.data.delete({
    where: { id },
  });
}

export async function displayFiles() {
  return await prisma.data.findMany();
}