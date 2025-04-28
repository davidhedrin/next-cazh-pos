import { PrismaClient } from "@prisma/client";
import { softDeleteMiddleware } from "./middleware";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
let prisma: PrismaClient;

if(!globalForPrisma.prisma) {
  prisma = new PrismaClient();
  prisma.$use(softDeleteMiddleware);
  globalForPrisma.prisma = prisma;
}else{
  prisma = globalForPrisma.prisma;
};

export const db = prisma;

// const globalForPrisma = global as unknown as { prisma: PrismaClient };
// const prisma = globalForPrisma.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
// export const db = prisma;