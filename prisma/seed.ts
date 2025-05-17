import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import businessSeeder from "./seeds/business-seeder";
import menusSeeder from "./seeds/menus-seeder";
import rolesSeeder from "./seeds/roles-seeder";
import rolesmenusSeeder from "./seeds/rolemenus-seeder";
import usersSeeder from "./seeds/user-seeder";
import storesSeeder from "./seeds/store-seeder";
import storesAccessSeeder from "./seeds/store-access-seeder";

async function main(){
  await businessSeeder(prisma);
  await storesSeeder(prisma);
  await menusSeeder(prisma);
  await rolesSeeder(prisma);
  await rolesmenusSeeder(prisma);
  await usersSeeder(prisma);
  await storesAccessSeeder(prisma);

  console.log('Seeding finished.');
};

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});