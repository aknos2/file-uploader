import prisma from "../lib/prisma.js";

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

export async function uploadFile(name, size, userId) {
  return await prisma.data.create({
    data: {name, size, userId}
  });
}

export async function displayFiles() {
  return await prisma.data.findMany();
}