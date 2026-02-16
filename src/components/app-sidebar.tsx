import * as React from "react";

import { NavHeader } from "@/components/nav-header";
import { NavMain, NavMainSkeleton } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function getUserRole() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  return session.user.role;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="bg-background" {...props}>
      <SidebarHeader className="border-b h-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background">
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <Suspense fallback={<NavMainSkeleton />}>
          <NavMain rolePromise={getUserRole()} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter className="bg-background">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
