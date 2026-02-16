"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { RECRUITER_NAV_ITEMS } from "@/const/navigation";
import { authClient } from "@/lib/auth-client";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";

interface NavMainProps {
  rolePromise: Promise<typeof authClient.$Infer.Session.user.role>;
}

export function NavMain({ rolePromise }: NavMainProps) {
  const role = use(rolePromise);
  const pathname = usePathname();

  let items;

  switch (role) {
    // case "admin":
    //   items = [...ADMIN_NAV_ITEMS];
    //   break;
    case "recruiter":
      items = RECRUITER_NAV_ITEMS;
      break;
    // case "candidate":
    //   items = CANDIDATE_NAV_ITEMS;
    //   break;
    default:
      items = [];
      break;
  }

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-2">
        {items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              size="lg"
              tooltip={item.label}
              isActive={pathname === item.href}
              className="group data-[active=true]:bg-sidebar-primary/10 data-[active=true]:text-sidebar-primary"
              asChild
            >
              <Link href={item.href as Route}>
                <div className="bg-sidebar-primary/10 group-data-[active=true]:bg-sidebar-primary group-data-[active=true]:text-sidebar-primary-foreground text-sidebar-primary flex aspect-square size-8 items-center justify-center rounded-lg">
                  <item.icon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{item.label}</span>
                  <span className="truncate font-normal text-xs">
                    {item.description}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavMainSkeleton() {
  return (
    <SidebarGroup>
      <SidebarMenu className="gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2 p-2">
            <Skeleton className="aspect-square size-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-3 max-w-20" />
            </div>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
