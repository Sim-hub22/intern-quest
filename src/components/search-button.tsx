"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { RECRUITER_NAV_ITEMS } from "@/const/navigation";
import { Search } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { useState } from "react";

export function SearchButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="min-w-60 justify-start text-muted-foreground!"
        onClick={() => setOpen(true)}
      >
        <Search />
        <span>Search...</span>
        <KbdGroup className="ml-auto">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {RECRUITER_NAV_ITEMS.map((item) => (
                <CommandItem key={item.href} asChild>
                  <Link href={item.href as Route}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
