import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "BusinessInfo" RESTART IDENTITY CASCADE;`);
    
    await tx.businessInfo.createMany({
      data: [
        { slug: "st-001", name: "System POS", createdBy: "SEEDER" }, // ID: 1
      ]
    });
  });
  console.log('Multiple Business Created!');
}