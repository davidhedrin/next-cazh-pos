"use client";

import { usePathname } from 'next/navigation';
import React from 'react'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ModeToggle } from '@/components/mode-toggle';

export default function LayoutWraper({ children }: Readonly<{ children: React.ReactNode; }>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/' || pathname === '/not-found' || pathname.startsWith('/auth');

  return (
    <>
      {
        !isAuthPage ? <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 62)",
              "--header-height": "calc(var(--spacing) * 10)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="relative flex flex-col gap-3 overflow-auto p-4 lg:p-5 lg:py-3">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider> : <>
          <div className="fixed top-1/2 right-0 transform -translate-y-1/2 p-4">
            <ModeToggle variant={'outline'} />
          </div>
          {children}
        </>
      }
    </>
  )
}
