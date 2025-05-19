import { GroupAppsMenu } from "./models-type";

export default function AppsMenu(): GroupAppsMenu[] {
  return [
    {
      groupName: "Apps",
      menus: [
        {
          title: "Dashboard",
          url: "/apps/dashboard",
          icon: "bx bx-tachometer",
          slug: "app-dsb",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Catalog",
          url: "#",
          icon: "bx bx-cart-add",
          slug: "app-ctl",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Transactions",
          url: "#",
          icon: "bx bx-receipt",
          slug: "app-trs",
          read: false,
          create: false,
          update: false,
          delete: false
        },
      ]
    },
    {
      groupName: "Modules",
      menus: [
        {
          title: "Absence",
          url: "#",
          icon: "bx bx-calendar-check",
          slug: "mdl-abs",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Messages",
          url: "#",
          icon: "bx bx-conversation",
          slug: "mdl-msg",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Announcements",
          url: "#",
          icon: "bx bx-bell bx-tada",
          slug: "mdl-anc",
          read: false,
          create: false,
          update: false,
          delete: false
        },
      ]
    },
    {
      groupName: "Warehouse",
      menus: [
        {
          title: "Product",
          url: "#",
          icon: "bx bx-package",
          slug: "whs-prd",
          read: false,
          create: false,
          update: false,
          delete: false,
          items: [
            {
              title: "Pricing",
              url: "#",
              slug: "whs-prd-prs",
              read: false,
              create: false,
              update: false,
              delete: false
            },
            {
              title: "Categories",
              url: "#",
              slug: "whs-prd-ctg",
              read: false,
              create: false,
              update: false,
              delete: false
            },
          ],
        },
        {
          title: "Inventory",
          url: "#",
          icon: "bx bx-archive",
          slug: "whs-ivt",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Discounts",
          url: "#",
          icon: "bx bx-purchase-tag-alt",
          slug: "whs-dsc",
          read: false,
          create: false,
          update: false,
          delete: false
        },
      ]
    },
    {
      groupName: "Reports & Analytics",
      menus: [
        {
          title: "Sales",
          url: "#",
          icon: "bx bx-line-chart",
          slug: "rna-sls",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Stock",
          url: "#",
          icon: "bx bx-bar-chart-alt-2",
          slug: "rna-stc",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Financial",
          url: "#",
          icon: "bx bx-calculator",
          slug: "rna-fin",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Product Traffic",
          url: "#",
          icon: "bx bx-stats",
          slug: "rna-ptr",
          read: false,
          create: false,
          update: false,
          delete: false
        },
      ]
    },
    {
      groupName: "Configurations",
      menus: [
        {
          title: "User Management",
          url: "/system-config/user-management",
          icon: "bx bx-user-pin",
          slug: "usm-usl",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Roles & Permissions",
          url: "/system-config/roles-permission",
          icon: "bx bx-shield-quarter",
          slug: "usm-rnp",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Bank Account",
          url: "#",
          icon: "bx bx-wallet",
          slug: "usm-bka",
          read: false,
          create: false,
          update: false,
          delete: false
        },
      ]
    },
    {
      groupName: "Settings",
      menus: [
        {
          title: "Store Information",
          url: "/settings/store-info",
          icon: "bx bx-store-alt",
          slug: "set-sri",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "Activity Logs",
          url: "#",
          icon: "bx bx-history",
          slug: "set-acl",
          read: false,
          create: false,
          update: false,
          delete: false
        },
        {
          title: "My Profile",
          url: "#",
          icon: "bx bx-id-card",
          slug: "set-prf",
          read: false,
          create: false,
          update: false,
          delete: false
        },
      ]
    },
  ];
};