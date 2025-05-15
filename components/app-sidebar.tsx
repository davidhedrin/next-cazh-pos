"use client"

import { useEffect, useState } from "react";
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
import AppsMenu from "@/lib/default-menus";
import { GroupAppsMenu, AppSidebarMenu } from "@/lib/models-type";
import { GetUserRole } from "@/app/api/action";
import { RoleMenus } from "@prisma/client";
import { useRole } from "@/contexts/role-context";
import { Skeleton } from "./ui/skeleton";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const appName = process.env.NEXT_PUBLIC_APPS_NAME || "Cazh POS";
  const [appMenus, setAppMenus] = useState<GroupAppsMenu[] | null>();
  const { setRoleMenus } = useRole();

  useEffect(() => {
    const fatchData = async () => {
      const defaultMenu = AppsMenu();
      const roleMenus = await GetUserRole();
      const filteredMenus = filterAppsMenu(defaultMenu, roleMenus?.role_menus ?? []);
      setAppMenus(filteredMenus);
      if (roleMenus && roleMenus.role_menus) setRoleMenus(roleMenus.role_menus);
    };
    fatchData();
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-orange-600 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <i className='bx bx-shopping-bag text-2xl'></i>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-orange-600">{appName}</span>
                  <span className="truncate text-xs">Smart & Easy Cash Flow</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <hr className="my-2" />
      <SidebarContent>
        <Skeleton className="h-full" />
        {
          appMenus && appMenus.map((x, index) => {
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

function filterAppsMenu(
  appsMenuOriginal: GroupAppsMenu[],
  roleMenus?: RoleMenus[] | null
): GroupAppsMenu[] {
  if (!roleMenus) return [];

  const findInRole = (menu: AppSidebarMenu): AppSidebarMenu | null => {
    const perm = roleMenus.find(x => x.menu_slug === menu.slug);
    if (!perm) return null;

    return {
      ...menu,
      create: perm.create ?? false,
      read: perm.read ?? false,
      update: perm.update ?? false,
      delete: perm.delete ?? false,
      isActive: false,
      items: menu.items,
    };
  };

  return appsMenuOriginal.map((group) => {
    const setMenus = group.menus.map((menu) => {
      const findMenu = findInRole(menu);
      if (!findMenu) return null;

      const menuItems = findMenu.items?.map(findInRole).filter(Boolean) as AppSidebarMenu[];

      return {
        ...findMenu,
        items: menuItems?.length ? menuItems : null,
      };
    }).filter(Boolean) as AppSidebarMenu[];

    if (setMenus.length === 0) return null;
    return {
      groupName: group.groupName,
      menus: setMenus,
    };
  }).filter(Boolean) as GroupAppsMenu[];
}