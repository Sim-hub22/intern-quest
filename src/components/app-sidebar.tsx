"use client";

import * as React from "react";

import { NavHeader } from "@/components/nav-header";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { RECRUITER_NAV_ITEMS } from "@/const/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="bg-background" {...props}>
      <SidebarHeader className="border-b h-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background">
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavMain items={RECRUITER_NAV_ITEMS} />
      </SidebarContent>
      <SidebarFooter className="bg-background">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
