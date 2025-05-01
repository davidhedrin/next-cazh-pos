import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.menus.createMany({
    data: [
      { slug: "app-dsb", name: "Dashboard", createdBy: "SEEDER" }, // ID: 1
      { slug: "app-ctl", name: "Catalog", createdBy: "SEEDER" }, // ID: 2
      { slug: "app-trs", name: "Transactions", createdBy: "SEEDER" }, // ID: 3
      { slug: "app-abs", name: "Absence", createdBy: "SEEDER" }, // ID: 4
      { slug: "app-msg", name: "Messages", createdBy: "SEEDER" }, // ID: 5
      { slug: "app-anc", name: "Announcements", createdBy: "SEEDER" }, // ID: 6

      { slug: "whs-prd", name: "Product", createdBy: "SEEDER" }, // ID: 7
      { slug: "whs-prd-pr", name: "Pricing", createdBy: "SEEDER" }, // ID: 8
      { slug: "whs-prd-ct", name: "Categories", createdBy: "SEEDER" }, // ID: 9
      { slug: "whs-iv", name: "Inventory", createdBy: "SEEDER" }, // ID: 10
      { slug: "whs-ds", name: "Discounts", createdBy: "SEEDER" }, // ID: 11

      { slug: "rna-sls", name: "Sales", createdBy: "SEEDER" }, // ID: 12
      { slug: "rna-stc", name: "Stock", createdBy: "SEEDER" }, // ID: 13
      { slug: "rna-fin", name: "Financial", createdBy: "SEEDER" }, // ID: 14
      { slug: "rna-ptr", name: "Product Traffic", createdBy: "SEEDER" }, // ID: 15

      { slug: "usm-usl", name: "User Management", createdBy: "SEEDER" }, // ID: 16
      { slug: "usm-rnp", name: "Roles & Permissions", createdBy: "SEEDER" }, // ID: 17
      
      { slug: "set-sri", name: "Store Information", createdBy: "SEEDER" }, // ID: 18
      { slug: "set-acl", name: "Activity Logs", createdBy: "SEEDER" }, // ID: 19
      { slug: "set-prf", name: "My Profile", createdBy: "SEEDER" }, // ID: 20
    ]
  });
  console.log('Multiple Menus Created!');
}