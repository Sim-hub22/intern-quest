import { Logo } from "@/components/logo";
import { MobileMenuButton } from "@/components/mobile-menu-button";
import { NavigationButton } from "@/components/navigation-button";
import { Button } from "@/components/ui/button";
import { PUBLIC_NAV_ITEMS } from "@/const/navigation";
import {
  Authenticated,
  LoginButton,
  SignupButton,
  Unauthenticated,
} from "@/lib/auth-client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <NavigationButton key={item.href} href={item.href} size="sm">
                {item.label}
              </NavigationButton>
            ))}
          </div>

          {/* Desktop Authentication Actions */}
          <div className="hidden md:flex gap-2">
            <Authenticated>
              <Button size="sm" className="group" asChild>
                <Link href="/dashboard">
                  Dashboard{" "}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </Authenticated>
            <Unauthenticated>
              <LoginButton size="sm" variant="ghost" />
              <SignupButton size="sm" variant="default" />
            </Unauthenticated>
          </div>

          {/* Mobile Authentication Actions */}
          <MobileMenuButton />
        </div>
      </div>
    </nav>
  );
}
