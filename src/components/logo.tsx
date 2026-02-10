import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">IQ</span>
        </div>
        <span className="text-foreground font-medium">InternQuest</span>
      </Link>
    </div>
  );
}
