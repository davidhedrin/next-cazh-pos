import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect, useState } from "react";
import { GetUserAccessStore } from "@/app/api/actions/common";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StoresAccess } from "@prisma/client";


export function SiteHeader() {
  const [activeStore, setActiveStore] = useState<StoresAccess>();
  const [storeAccess, setStoreAccess] = useState<StoresAccess[] | null>();
  useEffect(() => {
    const fatchData = async () => {
      const storeAccess = await GetUserAccessStore();
      const localAccess = localStorage.getItem("store_access");

      if (localAccess) {
        let findActive;
        const fixStoreAccess = storeAccess?.map((item) => {
          if(item.store_slug === localAccess) findActive = item;
          return {
            ...item,
            is_default: item.store_slug === localAccess
          };
        });
        setStoreAccess(fixStoreAccess);
        setActiveStore(findActive);
      } else {
        const defaultStore = storeAccess?.find(X => X.is_default == true);
        if (defaultStore && defaultStore.store_slug) localStorage.setItem("store_access", defaultStore.store_slug);
        setActiveStore(defaultStore);
        setStoreAccess(storeAccess);
      }
    };
    fatchData();
  }, []);

  const changeStoreAccess = (store: StoresAccess) => {
    localStorage.setItem("store_access", store.store_slug);
    setStoreAccess((prev) => {
      return prev?.map((item) => ({
        ...item,
        is_default: item.store_slug === store.store_slug
      }));
    });
    window.location.reload();
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer">
              <i className='bx bx-store-alt text-lg'></i>
              <h1 className="text-sm font-medium">{activeStore?.store_name}</h1>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto" align="start">
            <DropdownMenuLabel>Select Access Store</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {
              storeAccess?.map(x => {
                return (
                  <DropdownMenuCheckboxItem key={x.id} checked={x.is_default} onClick={() => changeStoreAccess(x)}>{x.store_name}</DropdownMenuCheckboxItem>
                )
              })
            }
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2 gap-x-0">
          <ModeToggle variant={"ghost"} />
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button> */}
        </div>
      </div>
    </header>
  )
}
