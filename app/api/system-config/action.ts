"use server";

import { db } from "@/prisma/db";
import { PaginateResult, CommonParams } from "@/lib/models-type";
import { Prisma, Roles } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from 'zod';

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