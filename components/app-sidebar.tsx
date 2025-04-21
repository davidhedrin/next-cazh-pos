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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  appsMenu: [
    {
      groupName: "Apps",
      menus: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: "bx bx-tachometer",
          slug: "app-dsb"
        },
        {
          title: "Transactions",
          url: "#",
          icon: "bx bx-receipt",
          slug: "app-trs"
        },
        {
          title: "Absence",
          url: "#",
          icon: "bx bx-calendar-check",
          slug: "app-abs"
        },
        {
          title: "Messages",
          url: "#",
          icon: "bx bx-conversation",
          slug: "app-msg"
        },
        {
          title: "Announcements",
          url: "#",
          icon: "bx bx-bell bx-tada",
          slug: "app-anc"
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
          items: [
            {
              title: "Pricing",
              url: "#",
              slug: "whs-prd-prs"
            },
            {
              title: "Categories",
              url: "#",
              slug: "whs-prd-ctg"
            },
          ],
        },
        {
          title: "Inventory",
          url: "#",
          icon: "bx bx-archive",
          slug: "whs-ivt"
        },
        {
          title: "Discounts",
          url: "#",
          icon: "bx bx-purchase-tag-alt",
          slug: "whs-dsc"
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
          slug: "rna-sls"
        },
        {
          title: "Stock",
          url: "#",
          icon: "bx bx-bar-chart-alt-2",
          slug: "rna-stc"
        },
        {
          title: "Financial",
          url: "#",
          icon: "bx bx-calculator",
          slug: "rna-fin"
        },
        {
          title: "Product Traffic",
          url: "#",
          icon: "bx bx-stats",
          slug: "rna-ptr"
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
          slug: "set-sri"
        },
        {
          title: "Activity Logs",
          url: "#",
          icon: "bx bx-history",
          slug: "set-acl"
        },
        {
          title: "My Profile",
          url: "#",
          icon: "bx bx-id-card",
          slug: "set-prf"
        },
      ]
    },
    {
      groupName: "System Config",
      menus: [
        {
          title: "User List",
          url: "/system-config/user-list",
          icon: "bx bx-user-pin",
          slug: "usm-usl"
        },
        {
          title: "Roles & Permissions",
          url: "#",
          icon: "bx bx-shield-quarter",
          slug: "usm-rnp"
        },
      ]
    },
  ],
}

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
          data.appsMenu.map((x, index) => {
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
