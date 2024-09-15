import prisma from '../app/lib/db';



export const getUserByEmail = async (email:string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } })

    return user
  } catch (error) {
    return null
  }
}

export const getUserById = async (id:string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })

    return user
  } catch (error) {
    return null
  }
}

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();

    return users;
  } catch (error) {
    return null;
  }
}

export const getLastTwoUsers = async () => {
  try {
    return await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 2
    })
  } catch (error) {
    console.log(error)
    throw new Error("Error geting the last two users");
  }
}