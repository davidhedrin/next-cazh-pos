import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "StoresAccess" RESTART IDENTITY CASCADE;`);
  
    await tx.storesAccess.createMany({
      data: [
        {
          business_id: 1,
          is_default: true,
          user_id: 1,
          store_id: 1,
          store_slug: "1-JSTORE",
          store_name: "J-Store",
          createdBy: "SEEDER"
        },
        {
          business_id: 1,
          is_default: false,
          user_id: 1,
          store_id: 2,
          store_slug: "1-CIPSSTORE",
          store_name: "Cips Store",
          createdBy: "SEEDER"
        },
      ]
    });
  });
  console.log('Multiple Stores Access Created!');
}