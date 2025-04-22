"use server";

import { PaginateResult } from "@/lib/models-type";
import { db } from "@/prisma/db";
import { Prisma, Roles } from "@prisma/client";
import { z } from 'zod';

type PaginateUserParams = {
  curPage?: number;
  perPage?: number;
  where?: Prisma.RolesWhereInput;
  orderBy?: Prisma.RolesOrderByWithRelationInput | Prisma.RolesOrderByWithRelationInput[];
}

export async function GetData(params: PaginateUserParams = {}): Promise<PaginateResult<Roles>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {} } = params;
  const skip = (curPage - 1) * perPage;

  const [data, total] = await Promise.all([
    db.roles.findMany({
      skip,
      take: perPage,
      where,
      orderBy
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