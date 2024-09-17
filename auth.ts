import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./app/lib/db"
import { Adapter } from "next-auth/adapters"
import authConfig from "./auth.config"
import { getUserById } from './data/user';
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { getAccountByUserId } from './data/account';
import { UserRole } from "@prisma/client"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter:PrismaAdapter(prisma) as Adapter,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret:process.env.AUTH_SECRET,
  pages:{
    signIn: "/auth/login",
    signOut: '/auth/sign-out',
    error: "/auth/error"
  },
  events:{
    async linkAccount ({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
   
    async signIn({ user,account, profile, email, credentials }) {
     
      if(account?.provider !== "credentials") return true

      const existingUser = await getUserById(user.id as string);
      
      if  (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if(!twoFactorConfirmation){
          return false
        }

        // Delete twoFactor confirmation for next sign in
        await prisma.twoFactorConfirmation.delete({
          where:{ id:twoFactorConfirmation.id }
        });

        
      }
      
      return true;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        return {
          ...token,
          id:user.id
        };
      }
      
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id)
      
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.username = existingUser.username;
      token.gender = existingUser.gender;
      token.dateOfBirth = existingUser.dateOfBirth;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.password = existingUser.password

      return token;
    },
    
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.username = token.username as string;
        session.user.gender = token.gender as string;
        session.user.dateOfBirth = token.dateOfBirth as Date;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.password = token.password as string
      }

      return session;
    },
   
  },
 
  ...authConfig,
})