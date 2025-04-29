import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.roleMenus.createMany({
    data: [
      { role_id: 1, menu_id: 1, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 2, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 3, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 4, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 5, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 6, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 7, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 8, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 9, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 10, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 11, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 12, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 13, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 14, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 15, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 16, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 17, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 18, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 19, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
      { role_id: 1, menu_id: 20, create: true, read: true, update: true, delete: true, createdBy: "SEEDER" },
    ]
  });
  console.log('Multiple Role Menus Created!');
}