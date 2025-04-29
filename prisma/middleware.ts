import { Prisma } from '@prisma/client';

const softDeleteModels = [
  'BusinessInfo',
  'Menus',
  'Roles',
  'RoleMenus',
  'User',
  'Account',
  'StoresInfo',
];

export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
  const { model, action } = params;

  if(!softDeleteModels.includes(model!)) return next(params);

  if(["findUnique", 'findFirst', 'findMany'].includes(action)) {
    if(!params.args) params.args = {};
    if(!params.args.where) params.args.where = {};
    if(params.args.where.deletedAt === undefined) params.args.where.deletedAt = null;
  };

  // if(action === "delete"){
  //   params.action = "update";
  //   params.args = {
  //     where: params.args.where,
  //     data: {
  //       deletedAt: new Date()
  //     }
  //   }
  // };

  // if(action === "deleteMany"){
  //   params.action = "updateMany";
  //   if(!params.args.data) params.args.data = {}

  //   params.args.data.deletedAt = new Date();
  // };

  return next(params);
}