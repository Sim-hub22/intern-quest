import { cookies } from "next/headers";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={null}>
      <ProtectedLayout>{children}</ProtectedLayout>
    </Suspense>
  );
}

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value;
  const defaultOpen =
    sidebarState === undefined ? true : sidebarState === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="overflow-hidden max-h-screen">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
