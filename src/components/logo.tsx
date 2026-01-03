import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 ", className)}>
      <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-xl">IQ</span>
      </div>
      <span className="text-foreground text-xl">InternQuest</span>
    </div>
  );
}
