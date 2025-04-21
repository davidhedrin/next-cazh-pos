"use server";

import { db } from "@/prisma/db";
import { User } from "@prisma/client";

export async function GetDataUser(): Promise<User[]> {
  const getData = await db.user.findMany();
  return getData;
}