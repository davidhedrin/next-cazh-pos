"use server";

import { db } from "@/prisma/db";
import { auth } from "@/lib/auth-setup"
import { DefaultArgs } from "@prisma/client/runtime/library";
import { PaginateResult, CommonParams, UploadFileRespons } from "@/lib/models-type";
import { Prisma, Menus, Roles, RoleMenus, StoresAccess } from "@prisma/client";

import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';
import { stringWithTimestamp } from "@/lib/utils";

type GetDataMenusParams = {
  where?: Prisma.MenusWhereInput;
  orderBy?: Prisma.MenusOrderByWithRelationInput | Prisma.MenusOrderByWithRelationInput[];
  select?: Prisma.MenusSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataMenus(params: GetDataMenusParams): Promise<PaginateResult<Menus>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.menus.findMany({
      skip,
      take: perPage,
      where: {
        ...where,
        is_active: true
      },
      orderBy,
      select
    }),
    db.menus.count({ where })
  ]);

  return {
    data,
    meta: {
      page: curPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
};

export async function getUserAuth() {
  return await auth();
}

export async function GetUserRole(): Promise<Roles & {
  role_menus: RoleMenus[] | null;
} | null> {
  const user = await auth();
  if(!user || !user.user) return null;
  
  const findData = await db.roles.findUnique({
    where: { 
      id: user?.user?.role_id,
      is_active: true
    },
    include: {
      role_menus: true
    }
  });

  return findData;
}

export async function GetUserAccessStore(): Promise<StoresAccess[] | null> {
  const user = await auth();
  if(!user || !user.user || !user?.user?.id) return null;

  const findData = await db.storesAccess.findMany({
    where: { 
      user_id: parseInt(user?.user?.id),
      store: {
        is_active: true
      }
    }
  });

  return findData;
}

export async function UploadFile(file: File, loc: string, prefix?: string): Promise<UploadFileRespons> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
  
    const uploadsDir = path.join(process.cwd(), loc);
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  
    const randomName = stringWithTimestamp(5);
    const originalExt = path.extname(file.name);
    if (!originalExt) {
      throw new Error("File must have an extension");
    }

    const fileName = `${prefix ? prefix + '-' : ''}${randomName}${originalExt}`;
    const filePath = path.join(uploadsDir, fileName);
  
    await writeFile(filePath, buffer);
    return {
      status: true,
      message: "File upload successfully",
      filename: fileName,
      path: filePath
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message,
    };
  }
}