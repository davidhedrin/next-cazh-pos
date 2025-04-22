"use server";

import { db } from "@/prisma/db";
import { Resend } from 'resend';
import ResetPasswordTemplate from '@/components/email/reset-password';
import { randomUUID } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function ForgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  try {
    if(!resend) throw new Error("Resend api key not found!");
    
    // return {
    //   success: false,
    //   message: "Email service DISABLED now. Please try again later!",
    // };

    const findEmail = await db.user.findUnique({
      where: {
        email: email
      }
    });
    if(!findEmail) throw new Error("Sorry, but the email is not registration on Cazh-POS");

    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
    await db.passwordResetToken.create({
      data: {
        userId: findEmail.id,
        token,
      }
    });
    
    const { data, error } = await resend.emails.send({
      from: 'Cazh-POS <no-replay@cazh-pos.my.id>',
      to: [email.toString()],
      subject: 'Password Reset',
      react: ResetPasswordTemplate({
        url: `${baseUrl}/auth/reset-password?token=${token}`
      }),
    });

    if (error) {
      console.log("😡Email:", error);
      throw new Error(error.toString());
    }

    console.log("😁Email:", {
      message: "Email verification send successfuly.",
      ...data
    });
  } catch (error: any) {
    console.log("😡Email2:", error);
    throw new Error(error.message);
  }
}