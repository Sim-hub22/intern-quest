"use client";

import { Logo } from "@/components/logo";
import { NavigationButton } from "@/components/navigation-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PUBLIC_NAV_ITEMS } from "@/const/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Authenticated,
  LoginButton,
  SignupButton,
  Unauthenticated,
} from "@/lib/auth-client";
import { ArrowRight, MenuIcon } from "lucide-react";
import Link from "next/link";

export function MobileMenuButton() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <Logo />
        </SheetHeader>
        <div className="flex flex-col gap-4 p-4 flex-1 justify-center">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <NavigationButton
              key={item.href}
              href={item.href}
              className="w-full justify-center"
              size="lg"
            >
              {item.label}
            </NavigationButton>
          ))}
        </div>
        <SheetFooter>
          <Authenticated>
            <Button size="lg" className="group" asChild>
              <Link href="/dashboard">
                Dashboard{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </Authenticated>
          <Unauthenticated>
            <LoginButton size="lg" variant="outline" className="w-full" />
            <SignupButton size="lg" variant="default" className="w-full" />
          </Unauthenticated>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
