"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationButtonProps {
  href: Route;
  label: string;
  className?: string;
}

export function NavigationButton({
  href,
  label,
  className,
}: NavigationButtonProps) {
  const pathname = usePathname();

  return (
    <Button
      variant="ghost"
      className={cn(
        pathname === href ? "text-primary" : "text-muted-foreground",
        className
      )}
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}
