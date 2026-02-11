"use client";


import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RECRUITER_NAV_ITEMS } from "@/const/navigation";
import { usePathname } from "next/navigation";

export function NavMain({ items }: { items: typeof RECRUITER_NAV_ITEMS }) {
  const pathname = usePathname();

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
            >
              <div className="bg-sidebar-primary/10 group-data-[active=true]:bg-sidebar-primary group-data-[active=true]:text-sidebar-primary-foreground text-sidebar-primary flex aspect-square size-8 items-center justify-center rounded-lg">
                <item.icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{item.label}</span>
                <span className="truncate font-normal text-xs">
                  {item.description}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
