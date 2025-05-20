"use server";

import { db } from "@/prisma/db";
import { auth } from "@/lib/auth-setup";
import { PaginateResult, CommonParams, UploadFileRespons } from "@/lib/models-type";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Prisma, Roles, RoleMenus, Menus, User, Account } from "@prisma/client";
import { DtoRoles, DtoUserAccount } from "@/lib/dto";
import { genSecurePassword, hashPassword } from "@/lib/utils";
import { UploadFile } from "./common";

// Access Roles
type GetDataRolesParams = {
  where?: Prisma.RolesWhereInput;
  orderBy?: Prisma.RolesOrderByWithRelationInput | Prisma.RolesOrderByWithRelationInput[];
  select?: Prisma.RolesSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataRoles(params: GetDataRolesParams): Promise<PaginateResult<Roles>> {
  const user = await auth();
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.roles.findMany({
      skip,
      take: perPage,
      where: {
        ...where,
        business_id: user?.user?.business_id
      },
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
export async function StoreUpdateDataRoles(formData: DtoRoles) {
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
              business_id: user?.business_id,
              role_id: roles.id,
              menu_id: x.menu_id ?? 0,
              menu_slug: x.menu_slug,
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
            business_id: user?.business_id,
            role_id: roles.id,
            menu_id: x.menu_id ?? 0,
            menu_slug: x.menu_slug,
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
// End Access Roles

// User Management
type GetDataUsersParams = {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
  select?: Prisma.UserSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataUsers(params: GetDataUsersParams): Promise<PaginateResult<
User & { account: Account | null, role: Roles | null}
>> {
  const user = await auth();
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.user.findMany({
      skip,
      take: perPage,
      where: {
        ...where,
        business_id: user?.user?.business_id
      },
      orderBy,
      select: {
        ...select,
        account: select?.account,
        role: select?.role
      }
    }),
    db.user.count({ where })
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
export async function StoreDataUser(formData:DtoUserAccount) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    let upFile: UploadFileRespons | null;
    if(formData.image_file) upFile = await UploadFile(formData.image_file, "public/upload/profile");

    const data_id = formData.id ?? 0;
    await db.$transaction(async (tx) => {
      const createRandomPass = genSecurePassword(10);
      const hashPass = await hashPassword(createRandomPass, 15);

      const txUser = await tx.user.upsert({
        where: { id: data_id },
        update: {
          role_id: formData.role_id,
          is_active: formData.is_active_user,
          updatedBy: user?.email
        },
        create: {
          business_id: user?.business_id,
          email: formData.email,
          password: hashPass,
          role_id: formData.role_id,
          is_active: formData.is_active_user,
          createdBy: user?.email
        }
      });

      const data_id_acc = formData.id_account ?? 0;
      await tx.account.upsert({
        where: { id: data_id_acc},
        update: {
          fullname: formData.fullname,
          image: upFile != null && upFile.status == true ? upFile.filename : null,
          image_path: upFile != null && upFile.status == true ? upFile.path : null,
          no_phone: formData.no_phone,
          gender: formData.gender,
          birth_date: formData.birth_date?.toString(),
          birth_place: formData.birth_place,
          is_active: formData.is_active_user
        },
        create: {
          business_id: user?.business_id,
          userId: txUser.id,
          fullname: formData.fullname,
          image: upFile != null && upFile.status == true ? upFile.filename : null,
          image_path: upFile != null && upFile.status == true ? upFile.path : null,
          no_phone: formData.no_phone,
          gender: formData.gender,
          birth_date: formData.birth_date?.toString(),
          birth_place: formData.birth_place,
          is_active: formData.is_active_user
        }
      });

      if(data_id > 0) {
        
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
// End User Management