"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavigationButtonProps extends React.ComponentProps<typeof Button> {
  href: Route;
}

export function NavigationButton({
  children,
  href,
  ...props
}: NavigationButtonProps) {
  const pathname = usePathname();

  return (
    <Button
      {...props}
      variant="ghost"
      asChild
      className={cn(pathname === href && "text-primary!", props.className)}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
