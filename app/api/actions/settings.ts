"use server";

import { db } from "@/prisma/db";
import { auth } from "@/lib/auth-setup";
import { PaginateResult, CommonParams } from "@/lib/models-type";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Prisma, StoresInfo } from "@prisma/client";
import { DtoStoreInfo } from "@/lib/dto";
import { stringWithTimestamp } from "@/lib/utils";

// Store Info
type GetDataStoresInfoParams = {
  where?: Prisma.StoresInfoWhereInput;
  orderBy?: Prisma.StoresInfoOrderByWithRelationInput | Prisma.StoresInfoOrderByWithRelationInput[];
  select?: Prisma.StoresInfoSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataStoresInfo(params: GetDataStoresInfoParams): Promise<PaginateResult<StoresInfo>> {
  const user = await auth();
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.storesInfo.findMany({
      skip,
      take: perPage,
      where: {
        ...where,
        business_id: user?.user?.business_id
      },
      orderBy,
      select
    }),
    db.storesInfo.count({ where })
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
export async function StoreUpdateDataStoreInfo(formData: DtoStoreInfo) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    await db.storesInfo.upsert({
      where: { id: data_id },
      update: {
        name: formData.name,
        desc: formData.desc,
        address: formData.address,
        no_tlp: formData.no_tlp,
        email: formData.email,
        is_active: formData.is_active,
        updatedBy: user?.email
      },
      create: {
        business_id: user?.business_id,
        slug: user?.business_id + "-" + stringWithTimestamp(5),
        name: formData.name,
        desc: formData.desc,
        address: formData.address,
        no_tlp: formData.no_tlp,
        email: formData.email,
        is_active: formData.is_active,
        createdBy: user?.email
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export async function GetDataStoreInfoById(id: number): Promise<StoresInfo | null> {
  const getData = await db.storesInfo.findUnique({
    where: {
      id
    }
  });
  
  return getData;
}
export async function DeleteDataStoreInfo(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.storesInfo.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date(),
        deletedBy: user?.email
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function AllStoreInfo() {
  const user = await auth();
  const allData = await db.storesInfo.findMany({
    where: { 
      is_active: true,
      business_id: user?.user?.business_id
    },
    select: {
      slug: true,
      name: true,
    }
  });
  return allData;
}
// End Store Info