"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { SearchButton } from "@/components/search-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RECRUITER_NAV_ITEMS } from "@/const/navigation";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const current = RECRUITER_NAV_ITEMS.find((item) => item.href === pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center w-full gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex h-4 items-center mr-2">
          <Separator orientation="vertical" className="h-full" />
        </div>
        <h1 className="text-base font-medium">
          {current?.label ?? "Dashboard"}
        </h1>

        <div className="flex items-center gap-2 ml-auto">
          <SearchButton />
          <div className="flex h-4 items-center ml-2">
            <Separator orientation="vertical" className="h-full" />
          </div>
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell />
          </Button>
          <div className="flex h-4 items-center">
            <Separator orientation="vertical" className="h-full" />
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
