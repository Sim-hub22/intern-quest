import { MobileMenuButton } from "@/components/mobile-menu-button";
import { NavigationButton } from "@/components/navigation-button";
import { Button } from "@/components/ui/button";
import { MENU_ITEMS } from "@/const/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import UserProfile from "./user-profile";

export async function Navigation() {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="sticky top-0 z-50 bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  IQ
                </span>
              </div>
              <span className="text-foreground">InternQuest</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {MENU_ITEMS.map((item) => (
              <NavigationButton
                key={item.href}
                href={item.href}
                label={item.label}
              />
            ))}
          </div>

          <div className="hidden md:flex gap-4">
            {sessionData?.user ? (
              <UserProfile user={sessionData.user} />
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <MobileMenuButton user={sessionData?.user || null} />
        </div>
      </div>
    </nav>
  );
}
