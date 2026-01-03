"use client";

import { NavigationButton } from "@/components/navigation-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MENU_ITEMS } from "@/const/navigation";
import { authClient } from "@/lib/auth-client";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import UserProfile from "./user-profile";

export function AuthenticationActions() {
  const { data: session } = authClient.useSession();

  return (
    <>
      {/* Desktop Authentication Actions */}
      <div className="hidden md:flex gap-4">
        {session?.user ? (
          <UserProfile user={session.user} />
        ) : (
          <>
            <Button variant="ghost" className="text-muted-foreground" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Authentication Actions */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
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
          </SheetHeader>
          <div className="flex flex-col gap-4 p-4">
            {MENU_ITEMS.map((item) => (
              <NavigationButton
                key={item.href}
                href={item.href}
                label={item.label}
                className="w-full justify-start"
              />
            ))}
          </div>
          <SheetFooter>
            {session?.user ? (
              <UserProfile user={session.user} />
            ) : (
              <>
                <Button variant="outline" className="w-full " asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
