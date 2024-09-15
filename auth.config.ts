import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs';
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "./data/user";
import { LoginSchema } from "./app/lib/zodSchemas";


 
export default { providers: [
  Google({
    clientId:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET
  }),
  Github({
    clientId:process.env.GITHUB_CLIENT_ID,
    clientSecret:process.env.GITHUB_CLIENT_SECRET
  }),
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'text', placeholder: 'your-email@example.com' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      const validateFields = LoginSchema.safeParse(credentials);

       if (validateFields.success) {
        const { email, password } = validateFields.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) return user;


      }

      return null;
    },
  }),

]
} satisfies NextAuthConfig