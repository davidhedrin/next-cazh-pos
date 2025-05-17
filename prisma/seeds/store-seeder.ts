import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "StoresInfo" RESTART IDENTITY CASCADE;`);
  
    await tx.storesInfo.createMany({
      data: [
        {
          business_id: 1,
          slug: "1-JSTORE",
          name: "J-Store",
          address: "Perumahan Alamanda 2, Blok EF 06/34, Mustika Jaya, Bekasi",
          no_tlp: "082110863133",
          email: "jesika0304@gmail.com",
          createdBy: "SEEDER"
        },
        {
          business_id: 1,
          slug: "1-CIPSSTORE",
          name: "Cips Store",
          address: "Taman adiyasa Blok N No 31, Solear Cisoka, Tangerang",
          no_tlp: "082110861234",
          email: "davidsimbolon@gmail.com",
          createdBy: "SEEDER"
        },
      ]
    });
  });
  console.log('Multiple Stores Created!');
}