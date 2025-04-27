import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  const user = await prisma.user.create({
    data: { 
      email: "davidhedrin123@gmail.com",
      password: "$2a$15$ygGbPlcO3BQsl1M29T5RUuTUKDrvY7zp4ny9X0Hc9js3qVZfMjF7K",
      email_verified: new Date(),
      business_id: 1,
      role_id: 1,
      createdBy: "SEEDER"
    },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      fullname: "David Simbolon",
      no_phone: "082110863133",
      gender: "Male",
      birth_date: "11 Desember 1999",
      birth_place: "Medan, Ranto Parapat",
    }
  });
  console.log('Multiple Users Created!');
}