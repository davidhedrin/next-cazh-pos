import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.roles.createMany({
    data: [
      { slug: "1-sp-adm", slug_name:"sp-adm", business_id: 1, name: "Super Administrator", createdBy: "SEEDER" }, // ID: 1
      { slug: "1-adm", slug_name:"adm", business_id: 1, name: "Administrator", createdBy: "SEEDER" }, // ID: 2
      { slug: "1-spv", slug_name:"spv", business_id: 1, name: "Supervisor", createdBy: "SEEDER" }, // ID: 3
      { slug: "1-emp", slug_name:"emp", business_id: 1, name: "Employee", createdBy: "SEEDER" }, // ID: 4
      { slug: "1-cst", slug_name:"cst", business_id: 1, name: "Customer", createdBy: "SEEDER" }, // ID: 5
    ]
  });
  console.log('Multiple Roles Created!');
}