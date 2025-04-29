"use server";

import { db } from "@/prisma/db";
import { auth } from "@/lib/auth-setup";
import { PaginateResult, CommonParams } from "@/lib/models-type";
import { Prisma, Roles, RoleMenus, Menus } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from 'zod';
import { DtoModuleAccess, DtoRoles } from "@/lib/dto-type";

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
};

export async function StoreDataRoles(formData: DtoRoles) {
  try {    
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    const listModule = formData.role_menus;

    await db.$transaction(async (tx) => {
      const createSlug = user?.business_id?.toString() + "-" + formData.slug_name
      const roles = await tx.roles.upsert({
        where: { id: data_id },
        update: {
          slug_name: formData.slug_name,
          is_active: formData.is_active,
          name: formData.name,
          updatedBy: user?.email
        },
        create: {
          slug: createSlug,
          slug_name: formData.slug_name,
          is_active: formData.is_active,
          name: formData.name,
          business_id: user?.business_id,
          createdBy: user?.email
        }
      });

      if(data_id > 0){
        const getExistMenus = await tx.roleMenus.findMany({
          where: {
            role_id: data_id
          }
        });
        const incomingIds = listModule.filter(x => x.id).map(x => x.id);
        const toDelete = getExistMenus.filter(x => !incomingIds.includes(x.id));
        const deleteDatas = toDelete.map(item =>
          tx.roleMenus.delete({
            where: { id: item.id }
          })
        );
        const updateOrCreate = listModule.map(x => {
          if(x.id && x.id > 0) return tx.roleMenus.update({
            where: { id: x.id },
            data: {
              create: x.create,
              read: x.read,
              update: x.update,
              delete: x.delete,
            }
          });
          else return tx.roleMenus.create({
            data: {
              role_id: roles.id,
              menu_id: x.menu_id ?? 0,
              create: x.create ?? null,
              read: x.read ?? null,
              update: x.update ?? null,
              delete: x.delete ?? null,
              createdBy: user?.email
            }
          });
        })

        await Promise.all([...updateOrCreate, ...deleteDatas]);
      }else{
        const listRoleMenus: Prisma.RoleMenusCreateManyInput[] = listModule.map(x => {
          return {
            role_id: roles.id,
            menu_id: x.menu_id ?? 0,
            create: x.create ?? null,
            read: x.read ?? null,
            update: x.update ?? null,
            delete: x.delete ?? null,
            createdBy: user?.email
          }
        });
        await tx.roleMenus.createMany({
          data: listRoleMenus
        });
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function DeleteDataRole(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.$transaction(async (tx) => {
      await tx.roleMenus.updateMany({
        where: {
          role_id: id
        },
        data: {
          deletedAt: new Date(),
          deletedBy: user?.email
        }
      });

      await tx.roles.update({
        where: {
          id
        },
        data: {
          deletedAt: new Date(),
          deletedBy: user?.email
        }
      });
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

type ReturnGetDataRoleById = Roles & {
  role_menus: (RoleMenus & {
    menu: Menus | null
  })[];
};
export async function GetDataRoleById(id: number): Promise<ReturnGetDataRoleById | null> {
  const getData = await db.roles.findUnique({
    where: {
      id
    },
    include: {
      role_menus: {
        include: {
          menu: true
        }
      }
    }
  });
  
  return getData;
}