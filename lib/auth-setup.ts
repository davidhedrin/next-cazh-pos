import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/prisma/db"
import { verifyPassword, hashPassword } from "./utils"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (cred) => {
        let finduser = null;
        const credEmail = cred?.email as string;
        const credPassword = cred?.password as string;
        finduser = await db.user.findUnique({
          where: {
            email: credEmail
          }
        });

        if (!finduser) throw new Error("Your email or password is incorrect!");
        
        const verifiedPass = await verifyPassword(credPassword, finduser.password)
        if(!verifiedPass) throw new Error("Your email or password is incorrect!");
        return finduser;
      }
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
  session: {
    strategy: "jwt"
  },
  trustHost: true
})