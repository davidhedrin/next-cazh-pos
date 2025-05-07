"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { signOutAuth } from '@/app/api/auth/action';
import { UseAlertDialog } from "@/components/alert-confirm";
import { useLoading } from '@/contexts/loading-context';
import { useState } from "react";
import { toast } from "sonner";

type NavUserProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  }
}

export function NavUser({
  user,
}: NavUserProps) {
  const [open, setOpen] = useState(false);
  const { openAlert } = UseAlertDialog();
  const { setLoading } = useLoading();
  const { isMobile } = useSidebar();

  const signOutAction = async () => {
    setOpen(false);
    const confirmed = await openAlert({
      title: 'Want to Logout?',
      description: 'Are you sure you want to log out of your account?',
      textConfirm: 'Log Me Out',
      textClose: 'Not Now',
      icon: 'bx bx-log-out bx-tada text-red-500'
    });
    if (!confirmed) return;

    toast.success("Logged Out!", {
      description: "We'll be here when you're ready to log back in.",
    });
    await signOutAuth();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <i className='bx bxs-chevrons-up ml-auto size-4'></i>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <i className='bx bx-award'></i>
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <i className='bx bx-badge-check'></i>
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className='bx bx-credit-card' ></i>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className='bx bx-bell' ></i>
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOutAction()}>
              <i className='bx bx-log-out'></i>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
