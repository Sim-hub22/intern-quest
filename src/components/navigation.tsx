"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import UserProfile from "./user-profile";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

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
            <Button
              variant="ghost"
              className={
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }
              asChild
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              variant="ghost"
              className={
                pathname === "/internships"
                  ? "text-primary"
                  : "text-muted-foreground"
              }
              asChild
            >
              <Link href="/internships">Internships</Link>
            </Button>
            <Button
              variant="ghost"
              className={
                pathname === "/resources"
                  ? "text-primary"
                  : "text-muted-foreground"
              }
              asChild
            >
              <Link href="/resources">Resources</Link>
            </Button>
            <Button variant="ghost" className="text-muted-foreground" asChild>
              <Link href="#about">About</Link>
            </Button>
          </div>

          <div className="hidden md:flex gap-4">
            {session?.user ? (
              <UserProfile />
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

          {/* Mobile Menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
              asChild
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathname === "/internships"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              asChild
            >
              <Link href="/internships">Internships</Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathname === "/resources"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              asChild
            >
              <Link href="/resources">Resources</Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              asChild
            >
              <Link href="#about">About</Link>
            </Button>
            {session?.user ? (
              <UserProfile />
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
