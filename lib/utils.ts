import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hashPassword(password: string, salt: number = 10): Promise<string> {
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}

export function SonnerPromise(title: string = "Loading data...", desc: string = "Just a sec, getting everything ready!") {
  const toastId = toast.loading(title, {
    description: desc,
  });

  return toastId;
}