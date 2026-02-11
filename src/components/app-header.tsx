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
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {current?.label ?? "Dashboard"}
        </h1>

        <div className="flex items-center gap-2 ml-auto">
          <SearchButton />
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
