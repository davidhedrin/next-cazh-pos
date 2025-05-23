import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`);
  
    const user = await tx.user.createMany({
      data: [
        { 
          email: "davidhedrin123@gmail.com",
          password: "$2a$15$ygGbPlcO3BQsl1M29T5RUuTUKDrvY7zp4ny9X0Hc9js3qVZfMjF7K",
          email_verified: new Date(),
          business_id: 1,
          role_id: 1,
          createdBy: "SEEDER"
        },
        { 
          email: "jesika123@gmail.com",
          password: "$2a$15$ygGbPlcO3BQsl1M29T5RUuTUKDrvY7zp4ny9X0Hc9js3qVZfMjF7K",
          email_verified: new Date(),
          business_id: 1,
          role_id: 2,
          createdBy: "SEEDER"
        },
        { 
          email: "jonatan123@gmail.com",
          password: "$2a$15$ygGbPlcO3BQsl1M29T5RUuTUKDrvY7zp4ny9X0Hc9js3qVZfMjF7K",
          email_verified: new Date(),
          business_id: 1,
          role_id: 3,
          createdBy: "SEEDER"
        }
      ]
    });
  
    await tx.account.createMany({
      data: [
        {
          business_id: 1,
          userId: 1,
          fullname: "David Simbolon",
          no_phone: "082110863133",
          gender: "Male",
          birth_date: new Date('1999-12-11'),
          birth_place: "Medan, Ranto Parapat",
        },
        {
          business_id: 1,
          userId: 2,
          fullname: "Jesika Marbun",
          no_phone: "082110860667",
          gender: "Female",
          birth_date: new Date('2000-04-03'),
          birth_place: "Tangerang, Taman Adiyasa",
        },
      ]
    });
  });
  console.log('Multiple Users Created!');
}