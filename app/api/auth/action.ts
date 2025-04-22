"use server";

import { db } from "@/prisma/db";
import { z } from 'zod';
import { hashPassword } from "@/lib/utils";
import { FormState } from "@/lib/models-type";
import { auth, signIn, signOut } from "@/lib/auth-setup"
import { AuthError } from "next-auth";

const FormSchemaSignUp = z.object({
  fullname: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  co_password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim()
}).refine((data) => data.password === data.co_password, {
  message: "Confirmation password don't match",
  path: ["co_password"]
});

const FormSchemaSignIn = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

const FormSchemaChangePass = z.object({
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  co_password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim()
}).refine((data) => data.password === data.co_password, {
  message: "Confirmation password don't match",
  path: ["co_password"]
});

export async function signInGoogle() {
  await signIn("google");
}

export async function signOutAuth() {
  await signOut({redirectTo: "/auth"});
}

export async function getUserAuth() {
  return await auth();
}

export async function signInCredential(_: any, formData: FormData): Promise<FormState> {
  const data = Object.fromEntries(formData);
  const valResult = FormSchemaSignIn.safeParse(data);
  if (!valResult.success) {
    return {
      errors: valResult.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/dashboard",
      email: data.email,
      password: data.password,
    });
    
    return {
      success: true,
      message: "Sign-In succesfuly.",
    };
  } catch (error: any) {
    if (error instanceof AuthError && error.type === "CallbackRouteError") error.message = "Your email or password is incorrect";
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function signUpAction(_: any, formData: FormData): Promise<FormState> {
  const data = Object.fromEntries(formData);
  const valResult = FormSchemaSignUp.safeParse(data);
  if (!valResult.success) {
    return {
      errors: valResult.error.flatten().fieldErrors,
    };
  }

  try {
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const hashPass = await hashPassword(password, 15);
  
    const createUser = await db.user.create({
      data: {
        email,
        password: hashPass,
        is_active: true
      }
    });
  
    await db.account.create({
      data: {
        userId: createUser.id,
        fullname,
        is_active: true
      }
    });

    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/dashboard",
      email,
      password
    });
    
    return {
      success: true,
      message: "Registration succesfuly.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function resetPassword(_: any, formData: FormData): Promise<FormState> {
  const data = Object.fromEntries(formData);
  const valResult = FormSchemaChangePass.safeParse(data);
  if (!valResult.success) {
    return {
      errors: valResult.error.flatten().fieldErrors,
    };
  }

  try {
    const password = formData.get("password") as string;
    const tokens = formData.get("token") as string;
    if(tokens === undefined || tokens.toString().trim() === "") return {
      success: false,
      message: "Looks like your token is missing. Click and try again!",
    };

    const findToken = await db.passwordResetToken.findUnique({
      where: {
        token: tokens,
        createAt: { gt: new Date(Date.now() - 1000 * 60 * 5)},
        reestAt: null
      }
    });
    if(!findToken) return {
      success: false,
      message: "We couldn't verify. The token may be incorrect or no longer valid.",
    };

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
    return {
      success: true,
      message: "Change password succesfuly.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}