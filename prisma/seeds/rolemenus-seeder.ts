import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "RoleMenus" RESTART IDENTITY CASCADE;`);
  
    await tx.roleMenus.createMany({
      data: [
        { role_id: 1, menu_id: 1, menu_slug: "app-dsb", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 2, menu_slug: "app-ctl", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 3, menu_slug: "app-trs", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 4, menu_slug: "app-abs", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 5, menu_slug: "app-msg", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 6, menu_slug: "app-anc", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 7, menu_slug: "whs-prd", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 8, menu_slug: "whs-prd-pr", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 9, menu_slug: "whs-prd-ct", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 10, menu_slug: "whs-iv", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 11, menu_slug: "whs-ds", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 12, menu_slug: "rna-sls", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 13, menu_slug: "rna-stc", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 14, menu_slug: "rna-fin", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 15, menu_slug: "rna-ptr", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 16, menu_slug: "usm-usl", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 17, menu_slug: "usm-rnp", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 18, menu_slug: "set-sri", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 19, menu_slug: "set-acl", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
        { role_id: 1, menu_id: 20, menu_slug: "set-prf", create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      ]
    });
  });
  console.log('Multiple Role Menus Created!');
}