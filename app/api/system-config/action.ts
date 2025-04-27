"use server";

import { db } from "@/prisma/db";
import { auth } from "@/lib/auth-setup";
import { PaginateResult, CommonParams } from "@/lib/models-type";
import { Prisma, Roles } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from 'zod';
import { DtoModuleAccess } from "@/lib/dto-type";

type GetDataRolesParams = {
  where?: Prisma.RolesWhereInput;
  orderBy?: Prisma.RolesOrderByWithRelationInput | Prisma.RolesOrderByWithRelationInput[];
  select?: Prisma.RolesSelect<DefaultArgs> | undefined;
} & CommonParams;

export async function GetDataRoles(params: GetDataRolesParams): Promise<PaginateResult<Roles>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;

  const [data, total] = await Promise.all([
    db.roles.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select
    }),
    db.roles.count({ where })
  ]);

  return {
    data,
    meta: {
      page: curPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total/perPage)
    }
  };
}

export async function StoreDataRoles(formData: FormData) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const listModule = formData.get("list_module") as string;
    const listModuleObj = JSON.parse(listModule) as DtoModuleAccess[];

    await db.$transaction(async (tx) => {
      const roles = await tx.roles.create({
        data: {
          slug: formData.get("slug") as string,
          slug_name: formData.get("slug") as string,
          name: formData.get("name") as string,
          business_id: user?.business_id
        }
      });

      const listRoleMenus: Prisma.RoleMenusCreateManyInput[] = listModuleObj.map(x => {
        return {
          role_id: roles.id,
          menu_id: x.menu_id ?? 0,
          create: x.create ?? null,
          read: x.read ?? null,
          update: x.update ?? null,
          delete: x.delete ?? null,
        }
      });

      await tx.roleMenus.createMany({
        data: listRoleMenus
      });
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}