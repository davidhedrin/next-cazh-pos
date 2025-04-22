"use server";

import { db } from "@/prisma/db";
import { hashPassword } from "@/lib/utils";
import { auth, signIn, signOut } from "@/lib/auth-setup"
import { AuthError } from "next-auth";

export async function signInGoogle() {
  await signIn("google");
}

export async function signOutAuth() {
  await signOut({redirectTo: "/auth"});
}

export async function getUserAuth() {
  return await auth();
}

export async function signInCredential(formData: FormData) {
  const data = Object.fromEntries(formData);
  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/dashboard",
      email: data.email,
      password: data.password,
    });
  } catch (error: any) {
    if (error instanceof AuthError && error.type === "CallbackRouteError") throw new Error("Your email or password is incorrect!");
  }
}

export async function signUpAction(formData: FormData) {
  try {
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const hashPass = await hashPassword(password, 15);
  
    db.$transaction(async (tx) => {
      const createUser = await tx.user.create({
        data: {
          email,
          password: hashPass,
          is_active: true
        }
      });
    
      await tx.account.create({
        data: {
          userId: createUser.id,
          fullname,
          is_active: true
        }
      });
    })

    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/dashboard",
      email,
      password
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const password = formData.get("password") as string;
    const tokens = formData.get("token") as string;
    if(tokens === undefined || tokens.toString().trim() === "") throw new Error("Looks like your token is missing. Click and try again!");

    const findToken = await db.passwordResetToken.findUnique({
      where: {
        token: tokens,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * 5)},
        reestAt: null
      }
    });
    if(!findToken) throw new Error("We couldn't verify. The token may be incorrect or no longer valid.");

    const hashPass = await hashPassword(password, 15);
    const updatePass = db.user.update({
      where: {
        id: findToken.userId
      },
      data: {
        password: hashPass
      }
    });

    const updateToken = db.passwordResetToken.update({
      where: {
        id: findToken.id
      },
      data: {
        reestAt: new Date()
      }
    });

    await db.$transaction([updatePass, updateToken]);
  } catch (error: any) {
    throw new Error(error.message);
  }
}