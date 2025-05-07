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
        const credEmail = cred?.email as string;
        const credPassword = cred?.password as string;
        const finduser = await db.user.findUnique({
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
    jwt({ token, user }) {
      if (user) {
        token.business_id = user.business_id
        token.role_id = user.role_id
      }
      return token
    },
    session({ session, token }) {
      session.user.business_id = token.business_id as number
      session.user.role_id =  token.role_id as number
      return session
    },
  },
  session: {
    strategy: "jwt"
  },
  trustHost: true
})