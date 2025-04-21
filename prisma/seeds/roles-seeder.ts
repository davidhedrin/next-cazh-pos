import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.roles.createMany({
    data: [
      { slug: "sp-adm", store_id: 1, name: "Super Administrator", createdBy: "SEEDER" }, // ID: 1
      { slug: "adm", store_id: 1, name: "Administrator", createdBy: "SEEDER" }, // ID: 2
      { slug: "spv", store_id: 1, name: "Supervisor", createdBy: "SEEDER" }, // ID: 3
      { slug: "emp", store_id: 1, name: "Employee", createdBy: "SEEDER" }, // ID: 4
      { slug: "cst", store_id: 1, name: "Customer", createdBy: "SEEDER" }, // ID: 5
    ]
  });
  console.log('Multiple Roles Created!');
}