import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.delete({
    where: {
      email: "kyle@test.com",
    },
  })

  console.log(user);
}

main()
  .catch(e => {
    console.log(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  //await prisma.$disconnect();