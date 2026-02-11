import { Logo } from "@/components/logo";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 "
          asChild
        >
          <Logo />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
