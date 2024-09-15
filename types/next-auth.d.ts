import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { auth } from '@/auth';

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  username: string;
  gender: string;
  dateOfBirth: Date;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  password:string;

}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    auth: any;
  }
}