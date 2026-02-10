import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function AuthShell({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) {
  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-6", className)}>
      <div className="flex items-center justify-center">
        <Logo />
      </div>
      {children}
    </div>
  );
}
