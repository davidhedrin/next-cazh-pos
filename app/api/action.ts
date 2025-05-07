"use server";

import { db } from "@/prisma/db";
import { auth } from "@/lib/auth-setup"
import { PaginateResult, CommonParams } from "@/lib/models-type";
import { Prisma, Menus, Roles, RoleMenus } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

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
      where,
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
  role_menus: RoleMenus[] | null
} | null> {
  const user = await auth();
  if(!user || !user.user) return null;
  
  const findData = await db.roles.findUnique({
    where: { id: user?.user?.role_id },
    include: {
      role_menus: true
    }
  });

  return findData;
}