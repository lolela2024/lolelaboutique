import prisma from '../app/lib/db';



export const getFactorTokenByToken = async (token:string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: { token }
    })

    return twoFactorToken;

  } catch (error) {
    return null
  }
}

export const getFactorTokenByEmail = async (email:string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: { email }
    })

    return twoFactorToken;
    
  } catch (error) {
    return null
  }
}