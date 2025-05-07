"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { GroupAppsMenu } from "@/lib/models-type"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  }
};

const appsMenu: GroupAppsMenu[] = [
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
        slug: "app-abs",
        read: false,
        create: false,
        update: false,
        delete: false
      },
      {
        title: "Messages",
        url: "#",
        icon: "bx bx-conversation",
        slug: "app-msg",
        read: false,
        create: false,
        update: false,
        delete: false
      },
      {
        title: "Announcements",
        url: "#",
        icon: "bx bx-bell bx-tada",
        slug: "app-anc",
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
    groupName: "Settings",
    menus: [
      {
        title: "Store Information",
        url: "#",
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
  {
    groupName: "System Config",
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
    ]
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const appName = process.env.NEXT_PUBLIC_APPS_NAME || "Cazh POS";

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <i className='bx bx-shopping-bag text-2xl'></i>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{appName}</span>
                  <span className="truncate text-xs">Smart & Easy Cash Flow</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <hr className="my-2" />
      <SidebarContent>
        {
          appsMenu.map((x, index) => {
            return <NavMain key={index} items={x} />
          })
        }
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
