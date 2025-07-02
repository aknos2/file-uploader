import prisma from "../lib/prisma.js";

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(username, email, password) {
  return await prisma.user.create({
    data: {username, email, password},
  })
}
