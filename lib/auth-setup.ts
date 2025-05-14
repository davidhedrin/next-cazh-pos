import NextAuth, { AuthError } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/prisma/db"
import { verifyPassword } from "./utils"

class CustomError extends AuthError {
  constructor(name: string, message: string) {
    super();
    this.name = name;
    this.message = message;
  }
}
 
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
        try {
          const credEmail = cred?.email as string;
          const credPassword = cred?.password as string;
          const finduser = await db.user.findUnique({
            where: {
              email: credEmail
            }
          });

          if (!finduser) throw new CustomError("Invalid credentials", "Your email or password is incorrect!");
          if(finduser.is_active == false) throw new CustomError("Account Blocked!", "Please contact administrator if this is a mistake.");
          
          const verifiedPass = await verifyPassword(credPassword, finduser.password)
          if(!verifiedPass) throw new CustomError("Invalid credentials", "Your email or password is incorrect!");

          return finduser;
        } catch (err: any) {
          throw new CustomError(err.name, err.message);
        }
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