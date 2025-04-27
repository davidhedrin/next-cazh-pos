import { User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    business_id?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    business_id?: number;
  }
}
